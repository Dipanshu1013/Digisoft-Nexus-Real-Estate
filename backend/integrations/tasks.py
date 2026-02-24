"""
DigiSoft Nexus — Celery Integration Tasks
backend/integrations/tasks.py

All external API calls run as Celery tasks:
  - Non-blocking: lead capture API responds immediately
  - Retry: 3 attempts with exponential backoff (60s, 120s, 300s)
  - Dead letter: FailedIntegrationLog after all retries exhausted
  - Idempotent: check LeadIntegrationRecord before creating duplicates
"""

import logging
from backend.celery_app import shared_task
from celery.exceptions import MaxRetriesExceededError

logger = logging.getLogger(__name__)


def _get_or_create_record(lead, platform):
    """Get or create a LeadIntegrationRecord for tracking sync state."""
    from .models import LeadIntegrationRecord
    record, _ = LeadIntegrationRecord.objects.get_or_create(
        lead=lead,
        platform=platform,
    )
    return record


def _handle_failure(task, lead, platform, task_name, kwargs, exc):
    """
    Called when all retries are exhausted.
    Creates a FailedIntegrationLog entry for manual review.
    """
    from .models import FailedIntegrationLog
    FailedIntegrationLog.objects.create(
        lead=lead,
        platform=platform,
        task_name=task_name,
        task_kwargs=kwargs,
        error_message=str(exc),
    )
    logger.error(f'[DEAD LETTER] {platform} task failed for lead {lead.id} after all retries: {exc}')


# ─── HubSpot Tasks ───────────────────────────────────────────────

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # seconds
    queue='integrations',
    name='integrations.tasks.push_to_hubspot',
)
def push_to_hubspot(self, lead_id: int) -> dict:
    """
    Create or update HubSpot contact + deal for a lead.
    Idempotent: checks LeadIntegrationRecord before creating duplicates.
    """
    from api.models import Lead
    from .models import IntegrationPlatform
    from . import hubspot_client as hs

    try:
        lead = Lead.objects.get(id=lead_id)
        record = _get_or_create_record(lead, IntegrationPlatform.HUBSPOT)

        # Create / update contact
        contact_id = hs.create_or_update_contact(lead)

        # Only create a new deal if we don't have one yet
        if not record.external_id:
            deal_id = hs.create_deal(lead, contact_id)
            record.mark_success(external_id=deal_id)
            return {'contact_id': contact_id, 'deal_id': deal_id, 'action': 'created'}
        else:
            # Update existing deal stage
            hs.update_deal_stage(record.external_id, lead.status)
            record.mark_success()
            return {'deal_id': record.external_id, 'action': 'updated'}

    except Exception as exc:
        try:
            logger.warning(f'HubSpot task failed for lead {lead_id} (attempt {self.request.retries + 1}): {exc}')
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        except MaxRetriesExceededError:
            from api.models import Lead
            from .models import IntegrationPlatform
            _handle_failure(self, Lead.objects.get(id=lead_id), IntegrationPlatform.HUBSPOT,
                           'integrations.tasks.push_to_hubspot', {'lead_id': lead_id}, exc)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    queue='integrations',
    name='integrations.tasks.update_hubspot_stage',
)
def update_hubspot_stage(self, lead_id: int, new_status: str) -> None:
    """Update HubSpot deal stage when lead status changes."""
    from api.models import Lead
    from .models import LeadIntegrationRecord, IntegrationPlatform
    from . import hubspot_client as hs

    try:
        lead = Lead.objects.get(id=lead_id)
        try:
            record = LeadIntegrationRecord.objects.get(lead=lead, platform=IntegrationPlatform.HUBSPOT)
            if record.external_id:
                hs.update_deal_stage(record.external_id, new_status)
                record.mark_success()
        except LeadIntegrationRecord.DoesNotExist:
            # No HubSpot record yet — push full lead instead
            push_to_hubspot.delay(lead_id)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


# ─── Zoho Tasks ──────────────────────────────────────────────────

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    queue='integrations',
    name='integrations.tasks.push_to_zoho',
)
def push_to_zoho(self, lead_id: int) -> dict:
    """Create or update Zoho CRM Lead."""
    from api.models import Lead
    from .models import IntegrationPlatform
    from . import zoho_client as zoho

    try:
        lead = Lead.objects.get(id=lead_id)
        record = _get_or_create_record(lead, IntegrationPlatform.ZOHO)

        zoho_id = zoho.create_or_update_lead(lead)
        record.mark_success(external_id=zoho_id)
        return {'zoho_id': zoho_id}

    except Exception as exc:
        try:
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        except MaxRetriesExceededError:
            from api.models import Lead
            from .models import IntegrationPlatform
            _handle_failure(self, Lead.objects.get(id=lead_id), IntegrationPlatform.ZOHO,
                           'integrations.tasks.push_to_zoho', {'lead_id': lead_id}, exc)


@shared_task(bind=True, max_retries=3, queue='integrations', name='integrations.tasks.update_zoho_stage')
def update_zoho_stage(self, lead_id: int, new_status: str) -> None:
    """Update Zoho lead status."""
    from api.models import Lead
    from .models import LeadIntegrationRecord, IntegrationPlatform
    from . import zoho_client as zoho

    try:
        lead = Lead.objects.get(id=lead_id)
        record = LeadIntegrationRecord.objects.get(lead=lead, platform=IntegrationPlatform.ZOHO)
        if record.external_id:
            zoho.update_lead_status(record.external_id, new_status)
            if new_status == 'closed-won':
                zoho.convert_lead_to_contact(record.external_id)
            record.mark_success()
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


# ─── WhatsApp Tasks ──────────────────────────────────────────────

@shared_task(
    bind=True,
    max_retries=2,
    default_retry_delay=30,
    queue='messaging',
    name='integrations.tasks.send_whatsapp_welcome',
)
def send_whatsapp_welcome(self, lead_id: int) -> dict:
    """Send welcome message immediately after lead creation."""
    from api.models import Lead
    from . import whatsapp_client as wa

    try:
        lead = Lead.objects.get(id=lead_id)
        if wa.check_opt_out(lead):
            logger.info(f'WhatsApp: lead {lead_id} has opted out — skipping welcome')
            return {'skipped': 'opted_out'}
        return wa.send_welcome_message(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)


@shared_task(
    bind=True,
    max_retries=2,
    queue='messaging',
    name='integrations.tasks.send_whatsapp_brochure',
)
def send_whatsapp_brochure(self, lead_id: int) -> dict:
    """Send brochure link 2 minutes after lead creation."""
    from api.models import Lead
    from . import whatsapp_client as wa

    try:
        lead = Lead.objects.get(id=lead_id)
        if wa.check_opt_out(lead):
            return {'skipped': 'opted_out'}
        return wa.send_brochure_message(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task(
    bind=True,
    max_retries=2,
    queue='messaging',
    name='integrations.tasks.send_whatsapp_site_visit',
)
def send_whatsapp_site_visit(self, lead_id: int, visit_date: str = '', visit_time: str = '') -> dict:
    """Send site visit confirmation when status changes to 'site-visit'."""
    from api.models import Lead
    from . import whatsapp_client as wa

    try:
        lead = Lead.objects.get(id=lead_id)
        if wa.check_opt_out(lead):
            return {'skipped': 'opted_out'}
        return wa.send_site_visit_confirmation(lead, visit_date or 'TBD', visit_time or 'TBD')
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task(
    bind=True,
    max_retries=2,
    queue='messaging',
    name='integrations.tasks.send_whatsapp_followup',
)
def send_whatsapp_followup(self, lead_id: int) -> dict:
    """
    Send follow-up message 24h after lead creation if still 'new'.
    Called by Celery Beat or a delayed task.
    """
    from api.models import Lead
    from . import whatsapp_client as wa

    try:
        lead = Lead.objects.get(id=lead_id)
        # Only send if still uncontacted
        if lead.status != 'new':
            return {'skipped': f'status_is_{lead.status}'}
        if wa.check_opt_out(lead):
            return {'skipped': 'opted_out'}
        return wa.send_followup_message(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=2, queue='messaging', name='integrations.tasks.send_whatsapp_win')
def send_whatsapp_win(self, lead_id: int) -> dict:
    """Send congratulations message when deal is closed-won."""
    from api.models import Lead
    from . import whatsapp_client as wa

    try:
        lead = Lead.objects.get(id=lead_id)
        return wa.send_deal_won_message(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)


# ─── Meta CAPI Tasks ─────────────────────────────────────────────

@shared_task(bind=True, max_retries=3, queue='integrations', name='integrations.tasks.push_meta_lead_event')
def push_meta_lead_event(self, lead_id: int) -> dict:
    """Fire Meta 'Lead' event when a lead is created."""
    from api.models import Lead
    from . import meta_client as meta

    try:
        lead = Lead.objects.get(id=lead_id)
        return meta.send_lead_event(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3, queue='integrations', name='integrations.tasks.push_meta_purchase_event')
def push_meta_purchase_event(self, lead_id: int, revenue_inr: int) -> dict:
    """Fire Meta 'Purchase' event when deal is closed-won."""
    from api.models import Lead
    from . import meta_client as meta

    try:
        lead = Lead.objects.get(id=lead_id)
        # Also fire Schedule event if we haven't
        meta.send_purchase_event(lead, revenue_inr)
        return {'status': 'sent', 'revenue': revenue_inr}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3, queue='integrations', name='integrations.tasks.push_meta_schedule_event')
def push_meta_schedule_event(self, lead_id: int) -> dict:
    """Fire Meta 'Schedule' event when site visit is booked."""
    from api.models import Lead
    from . import meta_client as meta

    try:
        lead = Lead.objects.get(id=lead_id)
        return meta.send_schedule_event(lead)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)


# ─── Maintenance Tasks ───────────────────────────────────────────

@shared_task(name='integrations.tasks.retry_failed_integrations')
def retry_failed_integrations() -> dict:
    """
    Re-queue any unresolved FailedIntegrationLog entries.
    Called every 10 minutes by Celery Beat.
    """
    from .models import FailedIntegrationLog
    unresolved = FailedIntegrationLog.objects.filter(resolved=False).select_related('lead')[:50]
    retried = 0
    for entry in unresolved:
        try:
            entry.retry()
            retried += 1
        except Exception as e:
            logger.warning(f'Re-queue failed for {entry}: {e}')
    logger.info(f'retry_failed_integrations: retried {retried} / {unresolved.count()} failed tasks')
    return {'retried': retried}


@shared_task(name='integrations.tasks.refresh_zoho_token')
def refresh_zoho_token() -> dict:
    """Refresh Zoho OAuth token. Called every 50 min by Celery Beat."""
    from . import zoho_client as zoho
    token = zoho._refresh_token()
    return {'status': 'refreshed', 'token_prefix': token[:8] + '…'}


@shared_task(name='integrations.tasks.send_daily_summary')
def send_daily_summary() -> dict:
    """
    Send daily lead summary to Slack at 8 AM IST.
    Pulls from the database for accurate counts.
    """
    from datetime import date, timedelta
    from api.models import Lead
    import requests

    yesterday = date.today() - timedelta(days=1)
    leads_yesterday = Lead.objects.filter(created_at__date=yesterday).count()
    new_leads       = Lead.objects.filter(created_at__date=yesterday, status='new').count()
    converted       = Lead.objects.filter(status='closed-won', updated_at__date=yesterday).count()

    message = (
        f"*DigiSoft Nexus — Daily Summary ({yesterday.strftime('%d %b %Y')})*\n"
        f"📥 New Leads: *{leads_yesterday}*\n"
        f"📞 Uncontacted: *{new_leads}*\n"
        f"🏆 Deals Closed: *{converted}*"
    )

    slack_url = getattr(__import__('django.conf', fromlist=['settings']).settings, 'SLACK_WEBHOOK_URL', None)
    if slack_url:
        requests.post(slack_url, json={'text': message}, timeout=5)
        logger.info('Daily summary sent to Slack')

    return {'leads': leads_yesterday, 'converted': converted}


# Task registry for FailedIntegrationLog.retry()
TASK_REGISTRY = {
    'integrations.tasks.push_to_hubspot': push_to_hubspot,
    'integrations.tasks.push_to_zoho':    push_to_zoho,
    'integrations.tasks.push_meta_lead_event': push_meta_lead_event,
    'integrations.tasks.push_meta_purchase_event': push_meta_purchase_event,
}
