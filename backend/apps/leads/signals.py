"""
DigiSoft Real Estate — Lead Signals
Triggers async CRM sync + WhatsApp automation on lead save
"""
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='leads.CapturedLead')
def on_lead_created(sender, instance, created, **kwargs):
    """On new lead: trigger HubSpot sync + WhatsApp message (async)."""
    if not created:
        return  # Only on first save

    from apps.leads.tasks import sync_lead_to_hubspot, send_whatsapp_welcome, sync_lead_to_zoho

    # HubSpot sync (always)
    sync_lead_to_hubspot.apply_async(args=[instance.id], countdown=5)

    # WhatsApp only if phone provided (Stage 2+)
    if instance.phone:
        send_whatsapp_welcome.apply_async(args=[instance.id], countdown=2)

    # Zoho sync (optional, lower priority)
    sync_lead_to_zoho.apply_async(args=[instance.id], countdown=15)

    # Update campaign lead count
    if instance.campaign_id:
        from apps.campaigns.models import AffiliateCampaign
        AffiliateCampaign.objects.filter(id=instance.campaign_id).update(
            total_leads=__import__('django.db.models', fromlist=['F']).F('total_leads') + 1
        )
