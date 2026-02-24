"""
DigiSoft Real Estate — Async Celery Tasks
CRM sync (HubSpot/Zoho) + WhatsApp automation
Triggered via Django post-save signals on CapturedLead
"""
import logging
import httpx
from backend.celery_app import shared_task
from django.conf import settings

logger = logging.getLogger(__name__)


# ==========================================
# HUBSPOT SYNC
# ==========================================
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def sync_lead_to_hubspot(self, lead_id: int):
    """
    Push a captured lead to HubSpot Contacts API.
    Retries 3 times with 60s delay on failure.
    """
    from apps.leads.models import CapturedLead
    try:
        lead = CapturedLead.objects.get(id=lead_id)
    except CapturedLead.DoesNotExist:
        logger.error(f"[HubSpot] Lead {lead_id} not found")
        return

    if not settings.HUBSPOT_API_KEY:
        logger.warning("[HubSpot] API key not configured — skipping sync")
        return

    payload = {
        "properties": {
            "firstname":        lead.first_name,
            "email":            lead.email,
            "phone":            lead.phone or '',
            "jobtitle":         lead.job_title or '',
            "hs_lead_status":   lead.status,
            # Custom HubSpot properties (create in HubSpot portal)
            "campaign_name":    lead.utm_campaign or '',
            "utm_source":       lead.utm_source or '',
            "utm_medium":       lead.utm_medium or '',
            "property_interest": lead.property_interest or '',
            "buyer_status":     lead.buyer_status or '',
        }
    }

    try:
        with httpx.Client(timeout=15) as client:
            response = client.post(
                'https://api.hubapi.com/crm/v3/objects/contacts',
                headers={
                    'Authorization': f'Bearer {settings.HUBSPOT_API_KEY}',
                    'Content-Type': 'application/json',
                },
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            # Save HubSpot contact ID back to lead
            CapturedLead.objects.filter(id=lead_id).update(
                hubspot_id=data.get('id', ''),
                crm_synced=True
            )
            logger.info(f"[HubSpot] Lead {lead_id} synced → contact {data.get('id')}")
    except httpx.HTTPStatusError as exc:
        logger.error(f"[HubSpot] HTTP error for lead {lead_id}: {exc.response.status_code}")
        self.retry(exc=exc)
    except Exception as exc:
        logger.error(f"[HubSpot] Error for lead {lead_id}: {exc}")
        self.retry(exc=exc)


# ==========================================
# WHATSAPP AUTOMATION (AiSensy)
# ==========================================
@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def send_whatsapp_welcome(self, lead_id: int):
    """
    Send instant WhatsApp message via AiSensy API.
    Contains: property brochure link + virtual tour + interactive menu.
    """
    from apps.leads.models import CapturedLead
    try:
        lead = CapturedLead.objects.get(id=lead_id)
    except CapturedLead.DoesNotExist:
        return

    if not lead.phone or not settings.AISENSY_API_KEY:
        logger.warning(f"[WhatsApp] Skipping — no phone or API key for lead {lead_id}")
        return

    # Clean phone number (ensure +91 prefix)
    phone = lead.phone.strip().replace(' ', '').replace('-', '')
    if not phone.startswith('+'):
        phone = f'+91{phone.lstrip("0")}'

    # Build personalised message
    property_name = lead.property_interest or 'our premium properties'
    message_body  = (
        f"Hi {lead.first_name}! 👋\n\n"
        f"Thank you for your interest in *{property_name}*.\n\n"
        f"Your dedicated advisor from Digisoft Nexus will call you shortly. "
        f"Meanwhile, here are your resources:\n\n"
        f"📄 Digital Brochure: https://digisoftnexus.com/brochure/{lead.utm_campaign or 'property'}\n"
        f"🏠 Virtual Tour: https://digisoftnexus.com/tour/{lead.utm_campaign or 'property'}\n\n"
        f"Reply:\n"
        f"*1* - 2 BHK options\n"
        f"*2* - 3 BHK options\n"
        f"*3* - Pricing & Floor Plans\n"
        f"*4* - Schedule Site Visit\n\n"
        f"📞 Direct helpline: +91 99100 XXXXX"
    )

    payload = {
        "apiKey":    settings.AISENSY_API_KEY,
        "campaignName": "property_welcome",
        "destination": phone,
        "userName":  lead.first_name,
        "source":    "digisoft-realestate",
        "media":     {},
        "templateParams": [],
        "tags":      [lead.utm_campaign or 'organic'],
        "attributes": {
            "customMessage": message_body
        }
    }

    try:
        with httpx.Client(timeout=15) as client:
            response = client.post(
                'https://backend.aisensy.com/campaign/t1/api/v2',
                json=payload,
            )
            response.raise_for_status()
            CapturedLead.objects.filter(id=lead_id).update(whatsapp_sent=True)
            logger.info(f"[WhatsApp] Message sent to lead {lead_id} → {phone}")
    except Exception as exc:
        logger.error(f"[WhatsApp] Error for lead {lead_id}: {exc}")
        self.retry(exc=exc)


# ==========================================
# ZOHO CRM SYNC
# ==========================================
@shared_task(bind=True, max_retries=3, default_retry_delay=90)
def sync_lead_to_zoho(self, lead_id: int):
    """Sync lead to Zoho CRM Leads module via OAuth2."""
    from apps.leads.models import CapturedLead
    if not all([settings.ZOHO_CLIENT_ID, settings.ZOHO_REFRESH_TOKEN]):
        return

    try:
        lead = CapturedLead.objects.get(id=lead_id)
    except CapturedLead.DoesNotExist:
        return

    # Step 1: Refresh access token
    try:
        with httpx.Client(timeout=15) as client:
            token_res = client.post('https://accounts.zoho.in/oauth/v2/token', params={
                'refresh_token': settings.ZOHO_REFRESH_TOKEN,
                'client_id':     settings.ZOHO_CLIENT_ID,
                'client_secret': settings.ZOHO_CLIENT_SECRET,
                'grant_type':    'refresh_token',
            })
            token_res.raise_for_status()
            access_token = token_res.json().get('access_token')

        # Step 2: Insert lead
        zoho_lead = {
            "First_Name":    lead.first_name,
            "Email":         lead.email,
            "Mobile":        lead.phone or '',
            "Lead_Source":   lead.utm_source or 'Website',
            "Lead_Status":   'Not Contacted',
            "Company":       lead.job_title or 'Individual',
            "Description":   f"Property Interest: {lead.property_interest} | Campaign: {lead.utm_campaign}",
        }

        lead_res = client.post(
            'https://www.zohoapis.in/crm/v2/Leads',
            headers={'Authorization': f'Zoho-oauthtoken {access_token}'},
            json={"data": [zoho_lead]},
        )
        lead_res.raise_for_status()
        zoho_id = lead_res.json().get('data', [{}])[0].get('details', {}).get('id', '')
        CapturedLead.objects.filter(id=lead_id).update(zoho_id=zoho_id)
        logger.info(f"[Zoho] Lead {lead_id} synced → Zoho ID {zoho_id}")

    except Exception as exc:
        logger.error(f"[Zoho] Error for lead {lead_id}: {exc}")
        self.retry(exc=exc)
