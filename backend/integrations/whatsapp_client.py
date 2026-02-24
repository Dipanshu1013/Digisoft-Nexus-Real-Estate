"""
DigiSoft Nexus — WhatsApp Business API Client
backend/integrations/whatsapp_client.py

Sends templated messages via Meta's WhatsApp Cloud API.
Templates must be pre-approved in Meta Business Manager.
"""

import logging
import hashlib
import hmac
import json
import re
from typing import Any
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

WA_BASE_URL = f'https://graph.facebook.com/v19.0/{settings.WA_PHONE_NUMBER_ID}'


def _clean_phone(phone: str) -> str:
    """
    Normalise phone number for WhatsApp.
    Input: +91 98765 43210 → Output: 919876543210
    """
    digits = re.sub(r'\D', '', phone)
    # Ensure Indian number has country code
    if len(digits) == 10 and digits[0] in '6789':
        digits = '91' + digits
    return digits


def _send_template(
    phone: str,
    template_name: str,
    language_code: str = 'en',
    components: list[dict] | None = None,
) -> dict:
    """Low-level WhatsApp template message sender."""
    payload: dict[str, Any] = {
        'messaging_product': 'whatsapp',
        'recipient_type': 'individual',
        'to': _clean_phone(phone),
        'type': 'template',
        'template': {
            'name': template_name,
            'language': {'code': language_code},
        },
    }
    if components:
        payload['template']['components'] = components

    r = requests.post(
        f'{WA_BASE_URL}/messages',
        headers={
            'Authorization': f'Bearer {settings.WA_ACCESS_TOKEN}',
            'Content-Type': 'application/json',
        },
        json=payload,
        timeout=10,
    )
    r.raise_for_status()
    return r.json()


def _log_message(lead, message_type: str, template: str, response: dict, error: str | None = None) -> None:
    """Save WA message log to database."""
    from .models import WhatsAppMessageLog
    wa_msg_id = None
    if response and 'messages' in response:
        wa_msg_id = response['messages'][0].get('id')

    WhatsAppMessageLog.objects.create(
        lead=lead,
        message_type=message_type,
        template_name=template,
        wa_message_id=wa_msg_id,
        status='failed' if error else 'sent',
        error=error,
    )


# ─── Message Templates ───────────────────────────────────────────

def send_welcome_message(lead) -> dict:
    """
    Sent immediately when a new lead is created.
    Template: lead_welcome_v1
    Variables: {{1}} = first name, {{2}} = property name
    """
    template = settings.WA_TEMPLATE_WELCOME
    components = [
        {
            'type': 'body',
            'parameters': [
                {'type': 'text', 'text': lead.first_name},
                {'type': 'text', 'text': lead.property_interest or 'your chosen property'},
            ],
        }
    ]
    try:
        response = _send_template(lead.phone, template, components=components)
        _log_message(lead, 'welcome', template, response)
        logger.info(f'WhatsApp welcome sent to lead {lead.id}')
        return response
    except Exception as e:
        _log_message(lead, 'welcome', template, {}, str(e))
        logger.error(f'WhatsApp welcome failed for lead {lead.id}: {e}')
        raise


def send_brochure_message(lead) -> dict:
    """
    Sent 2 minutes after lead creation with brochure link.
    Template: lead_brochure_v1
    Variables: {{1}} = first name, {{2}} = property name, {{3}} = brochure URL
    """
    template = 'lead_brochure_v1'
    brochure_url = f'https://digisoftnexus.com/brochures/{lead.property_slug or "general"}.pdf'
    components = [
        {
            'type': 'body',
            'parameters': [
                {'type': 'text', 'text': lead.first_name},
                {'type': 'text', 'text': lead.property_interest or 'the property'},
                {'type': 'text', 'text': brochure_url},
            ],
        }
    ]
    try:
        response = _send_template(lead.phone, template, components=components)
        _log_message(lead, 'brochure', template, response)
        return response
    except Exception as e:
        _log_message(lead, 'brochure', template, {}, str(e))
        raise


def send_followup_message(lead) -> dict:
    """
    Sent 24h after lead creation if status is still 'new'.
    Template: lead_followup_v1
    Variables: {{1}} = first name, {{2}} = property name, {{3}} = agent name
    """
    template = settings.WA_TEMPLATE_FOLLOWUP
    agent_name = lead.assigned_agent.get_full_name() if lead.assigned_agent else 'our team'
    components = [
        {
            'type': 'body',
            'parameters': [
                {'type': 'text', 'text': lead.first_name},
                {'type': 'text', 'text': lead.property_interest or 'the property'},
                {'type': 'text', 'text': agent_name},
            ],
        }
    ]
    try:
        response = _send_template(lead.phone, template, components=components)
        _log_message(lead, 'followup', template, response)
        logger.info(f'WhatsApp follow-up sent to lead {lead.id}')
        return response
    except Exception as e:
        _log_message(lead, 'followup', template, {}, str(e))
        raise


def send_site_visit_confirmation(lead, visit_date: str, visit_time: str) -> dict:
    """
    Sent when lead status changes to 'site-visit'.
    Template: site_visit_confirm_v1
    Variables: {{1}} = first name, {{2}} = property name, {{3}} = date, {{4}} = time, {{5}} = map link
    """
    template = settings.WA_TEMPLATE_SITEVISIT
    map_url = 'https://maps.google.com/?q=DigiSoft+Nexus+Gurugram'
    components = [
        {
            'type': 'body',
            'parameters': [
                {'type': 'text', 'text': lead.first_name},
                {'type': 'text', 'text': lead.property_interest or 'the property'},
                {'type': 'text', 'text': visit_date},
                {'type': 'text', 'text': visit_time},
                {'type': 'text', 'text': map_url},
            ],
        },
        {
            'type': 'button',
            'sub_type': 'url',
            'index': '0',
            'parameters': [{'type': 'text', 'text': 'confirm'}],
        },
    ]
    try:
        response = _send_template(lead.phone, template, components=components)
        _log_message(lead, 'sitevisit', template, response)
        return response
    except Exception as e:
        _log_message(lead, 'sitevisit', template, {}, str(e))
        raise


def send_deal_won_message(lead) -> dict:
    """
    Sent when lead is marked closed-won.
    Template: deal_congratulations_v1
    Variables: {{1}} = first name, {{2}} = property name
    """
    template = settings.WA_TEMPLATE_WIN
    components = [
        {
            'type': 'body',
            'parameters': [
                {'type': 'text', 'text': lead.first_name},
                {'type': 'text', 'text': lead.property_interest or 'your new home'},
            ],
        }
    ]
    try:
        response = _send_template(lead.phone, template, components=components)
        _log_message(lead, 'win', template, response)
        return response
    except Exception as e:
        _log_message(lead, 'win', template, {}, str(e))
        raise


# ─── Webhook Verification ────────────────────────────────────────

def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """
    Verify that an inbound webhook actually came from Meta.
    Signature header: X-Hub-Signature-256: sha256=<hex_digest>
    """
    expected = 'sha256=' + hmac.new(
        settings.WA_ACCESS_TOKEN.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def parse_status_update(payload: dict) -> list[dict]:
    """
    Parse WhatsApp webhook payload for message status updates.
    Returns list of {'wa_message_id': str, 'status': str} dicts.
    """
    updates = []
    for entry in payload.get('entry', []):
        for change in entry.get('changes', []):
            value = change.get('value', {})
            for status in value.get('statuses', []):
                updates.append({
                    'wa_message_id': status.get('id'),
                    'status': status.get('status'),  # sent, delivered, read, failed
                })
    return updates


def check_opt_out(lead) -> bool:
    """
    Check if a lead has opted out of WhatsApp messages.
    In production, store opt-outs in a Redis set for O(1) lookup.
    """
    from .models import WhatsAppMessageLog
    # Simple DB check — replace with Redis in production
    return WhatsAppMessageLog.objects.filter(
        lead=lead,
        status='opted_out',
    ).exists()
