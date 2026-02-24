"""
DigiSoft Nexus — Django Signals
backend/integrations/signals.py

Connects Lead model events → Celery integration tasks.
All external API calls are async (non-blocking).

Register in IntegrationsConfig.ready():
    from . import signals  # noqa
"""

import logging
from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)


@receiver(post_save, sender='api.Lead')
def on_lead_saved(sender, instance, created: bool, **kwargs) -> None:
    """
    Triggered every time a Lead is saved.
    Dispatches different tasks depending on whether it's a new lead
    or a status update on an existing one.
    """
    lead = instance

    if created:
        _handle_lead_created(lead)
    else:
        _handle_lead_updated(lead)


def _handle_lead_created(lead) -> None:
    """Fire all 'new lead' integration tasks asynchronously."""
    from .tasks import (
        push_to_hubspot,
        push_to_zoho,
        send_whatsapp_welcome,
        send_whatsapp_brochure,
        push_meta_lead_event,
    )

    logger.info(f'Lead {lead.id} created — dispatching integration tasks')

    # CRM pushes — run immediately
    push_to_hubspot.delay(lead.id)
    push_to_zoho.delay(lead.id)

    # Meta CAPI 'Lead' event — immediately
    push_meta_lead_event.delay(lead.id)

    # WhatsApp welcome — immediately
    send_whatsapp_welcome.delay(lead.id)

    # WhatsApp brochure — 2 minutes later (countdown in seconds)
    send_whatsapp_brochure.apply_async(args=[lead.id], countdown=120)

    # WhatsApp follow-up — 24 hours later if still 'new'
    send_whatsapp_followup_delayed.apply_async(args=[lead.id], countdown=86400)


def _handle_lead_updated(lead) -> None:
    """Handle status transitions on existing leads."""
    from .tasks import (
        update_hubspot_stage,
        update_zoho_stage,
        send_whatsapp_site_visit,
        send_whatsapp_win,
        push_meta_schedule_event,
        push_meta_purchase_event,
    )

    # We use a simple tracker to detect status changes.
    # Django doesn't provide old values in post_save — check pre_save cache instead.
    old_status = getattr(lead, '_pre_save_status', None)
    new_status = lead.status

    if old_status == new_status:
        return  # Score update, note added, agent changed — no status transition

    logger.info(f'Lead {lead.id} status: {old_status!r} → {new_status!r}')

    # Always sync status to CRMs
    update_hubspot_stage.delay(lead.id, new_status)
    update_zoho_stage.delay(lead.id, new_status)

    # Status-specific triggers
    if new_status == 'site-visit':
        send_whatsapp_site_visit.delay(lead.id)
        push_meta_schedule_event.delay(lead.id)

    elif new_status == 'closed-won':
        send_whatsapp_win.delay(lead.id)
        # Revenue estimation from budget range
        revenue = _estimate_revenue(lead.budget)
        push_meta_purchase_event.delay(lead.id, revenue)


def _estimate_revenue(budget_range: str | None) -> int:
    """
    Estimate deal revenue in INR from budget range string.
    Uses midpoint of the range. Returns 0 if unknown.
    """
    mapping = {
        '₹50L – ₹1 Cr':    7_500_000,
        '₹1 Cr – ₹2 Cr':  15_000_000,
        '₹2 Cr – ₹5 Cr':  35_000_000,
        '₹5 Cr – ₹10 Cr': 75_000_000,
    }
    return mapping.get(budget_range or '', 20_000_000)  # Default ₹2 Cr


# ─── Pre-save signal to capture old status ───────────────────────

from django.db.models.signals import pre_save

@receiver(pre_save, sender='api.Lead')
def capture_pre_save_status(sender, instance, **kwargs) -> None:
    """
    Cache the current status on the instance before saving.
    This lets post_save detect status transitions.
    """
    if instance.pk:
        try:
            old = sender.objects.get(pk=instance.pk)
            instance._pre_save_status = old.status
        except sender.DoesNotExist:
            instance._pre_save_status = None
    else:
        instance._pre_save_status = None


# ─── Delayed follow-up task (referenced in _handle_lead_created) ─

from .tasks import send_whatsapp_followup as send_whatsapp_followup_delayed
