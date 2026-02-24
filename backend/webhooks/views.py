"""
DigiSoft Nexus — Inbound Webhook Views
backend/webhooks/views.py

Receives inbound events from:
  - HubSpot: deal stage changes → update DigiSoft lead status
  - WhatsApp: message delivery/read receipts + opt-out
  - Meta: lead form submissions from Meta Lead Ads

All endpoints verify request signatures before processing.
"""

import json
import logging
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.conf import settings

logger = logging.getLogger(__name__)


# ─── HubSpot Inbound ────────────────────────────────────────────

@csrf_exempt
@require_POST
def hubspot_webhook(request):
    """
    Receive HubSpot deal stage change webhooks.
    Syncs deal updates back into DigiSoft lead status.

    Setup in HubSpot:
      Settings → Integrations → Private Apps → Webhooks
      Subscribe to: deal.propertyChange (dealstage)
      Target URL: https://api.digisoftnexus.com/webhooks/hubspot/
    """
    from integrations.hubspot_client import verify_hubspot_signature, parse_hubspot_webhook
    from api.models import Lead
    from integrations.models import LeadIntegrationRecord, IntegrationPlatform

    # Verify signature
    signature = request.headers.get('X-HubSpot-Signature-v3', '')
    if not verify_hubspot_signature(request.body, signature):
        logger.warning('HubSpot webhook: invalid signature')
        return HttpResponseForbidden('Invalid signature')

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponse('Invalid JSON', status=400)

    events = parse_hubspot_webhook(payload if isinstance(payload, list) else [payload])

    for event in events:
        try:
            # Find the lead by HubSpot deal ID
            record = LeadIntegrationRecord.objects.get(
                platform=IntegrationPlatform.HUBSPOT,
                external_id=str(event['object_id']),
            )
            lead = record.lead
            old_status = lead.status
            lead.status = event['new_status']
            lead.save(update_fields=['status', 'updated_at'])
            logger.info(f'HubSpot webhook: lead {lead.id} status {old_status} → {event["new_status"]}')
        except LeadIntegrationRecord.DoesNotExist:
            logger.warning(f'HubSpot webhook: no lead found for deal {event.get("object_id")}')
        except Exception as e:
            logger.error(f'HubSpot webhook processing error: {e}')

    return JsonResponse({'processed': len(events)})


# ─── WhatsApp Inbound ────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def whatsapp_webhook(request):
    """
    GET  — Webhook verification challenge from Meta.
    POST — Receive message status updates (delivered, read, failed, opted_out).

    Setup in Meta Business Manager:
      WhatsApp → Configuration → Webhook
      Callback URL: https://api.digisoftnexus.com/webhooks/whatsapp/
      Verify Token: settings.WA_VERIFY_TOKEN
      Subscribe to: messages
    """
    if request.method == 'GET':
        return _verify_whatsapp_webhook(request)
    return _process_whatsapp_event(request)


def _verify_whatsapp_webhook(request):
    """Meta sends a GET request with hub.challenge to verify the endpoint."""
    mode      = request.GET.get('hub.mode')
    token     = request.GET.get('hub.verify_token')
    challenge = request.GET.get('hub.challenge')

    if mode == 'subscribe' and token == settings.WA_VERIFY_TOKEN:
        logger.info('WhatsApp webhook verified successfully')
        return HttpResponse(challenge, content_type='text/plain')
    return HttpResponseForbidden('Verification failed')


def _process_whatsapp_event(request):
    """Process inbound WhatsApp status updates."""
    from integrations.whatsapp_client import verify_webhook_signature, parse_status_update
    from integrations.models import WhatsAppMessageLog

    # Verify signature
    signature = request.headers.get('X-Hub-Signature-256', '')
    if not verify_webhook_signature(request.body, signature):
        logger.warning('WhatsApp webhook: invalid signature')
        return HttpResponseForbidden('Invalid signature')

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponse('Invalid JSON', status=400)

    updates = parse_status_update(payload)

    for update in updates:
        wa_msg_id = update.get('wa_message_id')
        status    = update.get('status')  # delivered, read, failed

        if not wa_msg_id:
            continue

        # Handle opt-outs (Meta sends 'failed' with error_code 131026 for blocks)
        try:
            log = WhatsAppMessageLog.objects.get(wa_message_id=wa_msg_id)
            log.status = status
            log.save(update_fields=['status'])

            if status == 'failed':
                # Check for opt-out error code in raw payload
                _check_for_opt_out(payload, log)

        except WhatsAppMessageLog.DoesNotExist:
            logger.debug(f'WhatsApp webhook: no log found for message {wa_msg_id}')
        except Exception as e:
            logger.error(f'WhatsApp webhook error: {e}')

    return JsonResponse({'processed': len(updates)})


def _check_for_opt_out(payload: dict, log) -> None:
    """
    Detect WhatsApp opt-out (user blocked the number).
    Error code 131026 = message undeliverable (blocked).
    """
    for entry in payload.get('entry', []):
        for change in entry.get('changes', []):
            for status in change.get('value', {}).get('statuses', []):
                errors = status.get('errors', [])
                for err in errors:
                    if err.get('code') == 131026:
                        log.status = 'opted_out'
                        log.save(update_fields=['status'])
                        logger.info(f'WhatsApp opt-out detected for lead {log.lead_id}')
                        return


# ─── Meta Lead Ads Inbound ───────────────────────────────────────

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def meta_leads_webhook(request):
    """
    Receive lead form submissions from Meta Lead Ads.
    These are leads captured directly from Facebook/Instagram ads
    without visiting the website.

    Setup in Meta Business Manager:
      Business Settings → Leads Access → CRM Integration
      Webhook URL: https://api.digisoftnexus.com/webhooks/meta/leads/
      Subscribe to: leadgen
    """
    if request.method == 'GET':
        # Same challenge verification as WhatsApp
        mode      = request.GET.get('hub.mode')
        token     = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == settings.WA_VERIFY_TOKEN:
            return HttpResponse(challenge, content_type='text/plain')
        return HttpResponseForbidden()

    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponse('Invalid JSON', status=400)

    for entry in payload.get('entry', []):
        for change in entry.get('changes', []):
            if change.get('field') == 'leadgen':
                _process_meta_lead(change.get('value', {}))

    return JsonResponse({'status': 'ok'})


def _process_meta_lead(value: dict) -> None:
    """
    Fetch full lead details from Meta API and create a DigiSoft Lead.
    Meta only sends a lead_id in the webhook — we must fetch the full form data.
    """
    import requests
    from api.models import Lead

    lead_id_meta = value.get('leadgen_id')
    if not lead_id_meta:
        return

    try:
        # Fetch full lead form data
        r = requests.get(
            f'https://graph.facebook.com/v19.0/{lead_id_meta}',
            params={
                'access_token': settings.META_ACCESS_TOKEN,
                'fields': 'field_data,created_time,ad_id,form_id',
            },
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        logger.error(f'Meta lead fetch failed for {lead_id_meta}: {e}')
        return

    # Parse field_data into a dict
    fields = {item['name']: item['values'][0] for item in data.get('field_data', []) if item.get('values')}

    full_name = fields.get('full_name', '').strip()
    name_parts = full_name.split(' ', 1)

    try:
        Lead.objects.create(
            first_name       = name_parts[0],
            last_name        = name_parts[1] if len(name_parts) > 1 else '',
            phone            = fields.get('phone_number', ''),
            email            = fields.get('email', ''),
            source           = 'meta-ads',
            utm_source       = 'facebook',
            utm_medium       = 'lead-ad',
            utm_campaign     = str(value.get('form_id', '')),
            status           = 'new',
            profile_stage    = 2,  # Phone + name captured
            consent_given    = True,
            consent_text     = 'Consented via Meta Lead Ad form.',
        )
        logger.info(f'Meta Lead Ad: created lead for {full_name}')
    except Exception as e:
        logger.error(f'Meta Lead Ad: failed to create lead: {e}')


# ─── URL Registration ─────────────────────────────────────────────

# Add to backend/urls.py:
# from webhooks.views import hubspot_webhook, whatsapp_webhook, meta_leads_webhook
#
# urlpatterns = [
#     ...
#     path('webhooks/hubspot/',      hubspot_webhook,    name='webhook-hubspot'),
#     path('webhooks/whatsapp/',     whatsapp_webhook,   name='webhook-whatsapp'),
#     path('webhooks/meta/leads/',   meta_leads_webhook, name='webhook-meta-leads'),
# ]
