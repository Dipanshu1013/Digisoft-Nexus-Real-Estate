"""DigiSoft Nexus — Webhook Receivers"""
import json
import logging
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.conf import settings

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def hubspot_webhook(request):
    """Receive HubSpot deal stage webhooks."""
    try:
        payload = json.loads(request.body)
        logger.info(f'HubSpot webhook received: {len(payload) if isinstance(payload, list) else 1} events')
        return JsonResponse({'processed': True})
    except Exception as e:
        logger.error(f'HubSpot webhook error: {e}')
        return HttpResponse(status=400)


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def whatsapp_webhook(request):
    """WhatsApp webhook — GET for verification, POST for events."""
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == settings.WA_VERIFY_TOKEN:
            return HttpResponse(challenge, content_type='text/plain')
        return HttpResponse(status=403)

    try:
        payload = json.loads(request.body)
        logger.info(f'WhatsApp webhook received: {payload.get("entry", [])}')
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        logger.error(f'WhatsApp webhook error: {e}')
        return HttpResponse(status=400)


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def meta_leads_webhook(request):
    """Meta Lead Ads webhook."""
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == settings.WA_VERIFY_TOKEN:
            return HttpResponse(challenge, content_type='text/plain')
        return HttpResponse(status=403)

    try:
        payload = json.loads(request.body)
        for entry in payload.get('entry', []):
            for change in entry.get('changes', []):
                if change.get('field') == 'leadgen':
                    logger.info(f'Meta Lead Ad received: {change.get("value", {})}')
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        logger.error(f'Meta webhook error: {e}')
        return HttpResponse(status=400)
