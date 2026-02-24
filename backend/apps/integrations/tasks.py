"""DigiSoft Nexus — Celery Integration Tasks
All tasks are safe — they log errors but never crash the main app.
In dev mode (CELERY_TASK_ALWAYS_EAGER=True), they run synchronously.
"""
import logging
from backend.celery_app import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60, name='integrations.tasks.push_to_hubspot')
def push_to_hubspot(self, lead_id: int):
    """Push lead to HubSpot CRM."""
    from django.conf import settings
    if not settings.HUBSPOT_ACCESS_TOKEN:
        logger.debug(f'HubSpot not configured — skipping lead {lead_id}')
        return {'skipped': 'not_configured'}
    try:
        from apps.leads.models import Lead
        lead = Lead.objects.get(id=lead_id)
        import requests
        r = requests.post(
            'https://api.hubapi.com/crm/v3/objects/contacts',
            headers={'Authorization': f'Bearer {settings.HUBSPOT_ACCESS_TOKEN}', 'Content-Type': 'application/json'},
            json={'properties': {
                'firstname': lead.first_name, 'lastname': lead.last_name,
                'phone': lead.phone, 'email': lead.email or '',
                'property_interest': lead.property_interest or '',
            }},
            timeout=10
        )
        if r.status_code in (200, 201):
            contact_id = r.json().get('id', '')
            Lead.objects.filter(id=lead_id).update(hubspot_contact_id=contact_id)
            logger.info(f'HubSpot: created contact {contact_id} for lead {lead_id}')
            return {'contact_id': contact_id}
        logger.warning(f'HubSpot API error {r.status_code}: {r.text[:200]}')
    except Exception as exc:
        logger.error(f'HubSpot task error for lead {lead_id}: {exc}')
        try:
            raise self.retry(exc=exc)
        except Exception:
            pass
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=3, default_retry_delay=60, name='integrations.tasks.push_to_zoho')
def push_to_zoho(self, lead_id: int):
    """Push lead to Zoho CRM."""
    from django.conf import settings
    if not settings.ZOHO_REFRESH_TOKEN:
        logger.debug(f'Zoho not configured — skipping lead {lead_id}')
        return {'skipped': 'not_configured'}
    try:
        from apps.leads.models import Lead
        lead = Lead.objects.get(id=lead_id)
        logger.info(f'Zoho: would sync lead {lead_id} — {lead.full_name}')
        return {'status': 'simulated'}
    except Exception as exc:
        logger.error(f'Zoho task error for lead {lead_id}: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=2, default_retry_delay=30, name='integrations.tasks.send_whatsapp_welcome')
def send_whatsapp_welcome(self, lead_id: int):
    """Send WhatsApp welcome message."""
    from django.conf import settings
    if not settings.WA_ACCESS_TOKEN:
        logger.debug(f'WhatsApp not configured — skipping lead {lead_id}')
        return {'skipped': 'not_configured'}
    try:
        from apps.leads.models import Lead
        import requests
        lead = Lead.objects.get(id=lead_id)
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{settings.WA_PHONE_NUMBER_ID}/messages',
            headers={'Authorization': f'Bearer {settings.WA_ACCESS_TOKEN}', 'Content-Type': 'application/json'},
            json={
                'messaging_product': 'whatsapp',
                'to': lead.phone.replace('+', '').replace(' ', ''),
                'type': 'template',
                'template': {
                    'name': settings.WA_TEMPLATE_WELCOME,
                    'language': {'code': 'en'},
                    'components': [{'type': 'body', 'parameters': [
                        {'type': 'text', 'text': lead.first_name},
                        {'type': 'text', 'text': lead.property_interest or 'your chosen property'},
                    ]}],
                },
            },
            timeout=10
        )
        if r.status_code == 200:
            logger.info(f'WhatsApp welcome sent to lead {lead_id}')
            return {'status': 'sent'}
        logger.warning(f'WhatsApp error {r.status_code} for lead {lead_id}')
    except Exception as exc:
        logger.error(f'WhatsApp task error for lead {lead_id}: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=2, name='integrations.tasks.send_whatsapp_followup')
def send_whatsapp_followup(self, lead_id: int):
    """Send WhatsApp follow-up if still 'new' after 24h."""
    try:
        from apps.leads.models import Lead
        lead = Lead.objects.get(id=lead_id)
        if lead.status != 'new':
            return {'skipped': f'status_is_{lead.status}'}
        logger.info(f'WhatsApp follow-up would send to lead {lead_id}')
        return {'status': 'simulated'}
    except Exception as exc:
        logger.error(f'WhatsApp followup error for lead {lead_id}: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=2, name='integrations.tasks.send_whatsapp_site_visit')
def send_whatsapp_site_visit(self, lead_id: int):
    """Send site visit confirmation WhatsApp."""
    try:
        from apps.leads.models import Lead
        lead = Lead.objects.get(id=lead_id)
        logger.info(f'WhatsApp site visit confirmation for lead {lead_id}')
        return {'status': 'simulated'}
    except Exception as exc:
        logger.error(f'WhatsApp site visit error: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=2, name='integrations.tasks.send_whatsapp_win')
def send_whatsapp_win(self, lead_id: int):
    """Send deal won congratulations WhatsApp."""
    try:
        logger.info(f'WhatsApp win message for lead {lead_id}')
        return {'status': 'simulated'}
    except Exception as exc:
        logger.error(f'WhatsApp win error: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=3, name='integrations.tasks.push_meta_lead_event')
def push_meta_lead_event(self, lead_id: int):
    """Send Meta Conversions API Lead event."""
    from django.conf import settings
    if not settings.META_ACCESS_TOKEN:
        return {'skipped': 'not_configured'}
    try:
        import hashlib, time, requests
        from apps.leads.models import Lead
        lead = Lead.objects.get(id=lead_id)
        phone_digits = ''.join(filter(str.isdigit, lead.phone))
        if len(phone_digits) == 10:
            phone_digits = '91' + phone_digits
        r = requests.post(
            f'https://graph.facebook.com/v19.0/{settings.META_PIXEL_ID}/events',
            json={
                'data': [{
                    'event_name': 'Lead',
                    'event_time': int(time.time()),
                    'action_source': 'website',
                    'user_data': {
                        'ph': [hashlib.sha256(phone_digits.encode()).hexdigest()],
                        'em': [hashlib.sha256(lead.email.lower().encode()).hexdigest()] if lead.email else [],
                    },
                    'custom_data': {
                        'lead_id': str(lead.id),
                        'content_name': lead.property_interest or 'Property',
                    },
                    'event_id': f'lead_{lead.id}',
                }],
                'access_token': settings.META_ACCESS_TOKEN,
            },
            timeout=10
        )
        logger.info(f'Meta CAPI Lead event for lead {lead_id}: {r.status_code}')
        return {'status': r.status_code}
    except Exception as exc:
        logger.error(f'Meta CAPI error for lead {lead_id}: {exc}')
    return {'error': 'failed'}


@shared_task(bind=True, max_retries=3, name='integrations.tasks.push_meta_purchase_event')
def push_meta_purchase_event(self, lead_id: int, revenue_inr: int):
    """Send Meta Conversions API Purchase event for closed-won."""
    from django.conf import settings
    if not settings.META_ACCESS_TOKEN:
        return {'skipped': 'not_configured'}
    try:
        logger.info(f'Meta Purchase event for lead {lead_id}, revenue ₹{revenue_inr:,}')
        return {'status': 'simulated'}
    except Exception as exc:
        logger.error(f'Meta purchase error: {exc}')
    return {'error': 'failed'}
