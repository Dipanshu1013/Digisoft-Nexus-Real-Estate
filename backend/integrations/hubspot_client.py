"""
DigiSoft Nexus — HubSpot Integration
backend/integrations/hubspot_client.py

Handles bidirectional sync:
  - Lead created → HubSpot Contact + Deal
  - Lead status changed → HubSpot Deal Stage update
  - HubSpot webhook → Lead status update (via webhooks/views.py)

Uses HubSpot Private App token (no OAuth required for server-to-server).
"""

import logging
import hashlib
import hmac
from typing import Any
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

HUBSPOT_BASE_URL = 'https://api.hubapi.com'

# Map DigiSoft lead statuses → HubSpot deal stages
# Update these IDs to match your HubSpot pipeline stages
STAGE_MAP = {
    'new':          'appointmentscheduled',   # "New"
    'contacted':    'qualifiedtobuy',          # "Contacted"
    'site-visit':   'presentationscheduled',   # "Site Visit"
    'negotiation':  'decisionmakerboughtin',   # "Negotiation"
    'closed-won':   'closedwon',               # "Won"
    'closed-lost':  'closedlost',              # "Lost"
}

# HubSpot custom property names (create these in HubSpot Settings → Properties)
CUSTOM_PROPS = {
    'property_interest': 'property_interest',
    'lead_source_detail': 'lead_source_detail',
    'budget_range':       'budget_range',
    'buyer_status':       'buyer_status',
    'profile_stage':      'profile_stage',
    'lead_score':         'lead_score_digisoft',
    'utm_campaign':       'utm_campaign',
    'utm_source':         'utm_source',
    'utm_medium':         'utm_medium',
}


def _headers() -> dict:
    return {
        'Authorization': f'Bearer {settings.HUBSPOT_ACCESS_TOKEN}',
        'Content-Type': 'application/json',
    }


def _get(path: str, params: dict | None = None) -> dict | None:
    try:
        r = requests.get(f'{HUBSPOT_BASE_URL}{path}', headers=_headers(), params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except requests.RequestException as e:
        logger.error(f'HubSpot GET {path} failed: {e}')
        raise


def _post(path: str, data: dict) -> dict:
    r = requests.post(f'{HUBSPOT_BASE_URL}{path}', headers=_headers(), json=data, timeout=10)
    r.raise_for_status()
    return r.json()


def _patch(path: str, data: dict) -> dict:
    r = requests.patch(f'{HUBSPOT_BASE_URL}{path}', headers=_headers(), json=data, timeout=10)
    r.raise_for_status()
    return r.json()


# ─── Contact Operations ──────────────────────────────────────────

def find_contact_by_phone(phone: str) -> str | None:
    """Search for existing HubSpot contact by phone number. Returns hs_object_id or None."""
    try:
        data = _post('/crm/v3/objects/contacts/search', {
            'filterGroups': [{
                'filters': [{'propertyName': 'phone', 'operator': 'EQ', 'value': phone}]
            }],
            'properties': ['hs_object_id', 'phone', 'email'],
            'limit': 1,
        })
        results = data.get('results', [])
        return results[0]['id'] if results else None
    except Exception as e:
        logger.warning(f'HubSpot phone lookup failed: {e}')
        return None


def create_or_update_contact(lead) -> str:
    """
    Create a HubSpot contact from a Lead. If a contact with the same phone
    already exists, update it instead (idempotent).
    Returns the HubSpot contact ID.
    """
    existing_id = find_contact_by_phone(lead.phone)

    properties = {
        'firstname':  lead.first_name,
        'lastname':   lead.last_name,
        'phone':      lead.phone,
        'email':      lead.email or '',
        'hs_lead_status': 'NEW' if lead.status == 'new' else 'IN_PROGRESS',
        CUSTOM_PROPS['property_interest']: lead.property_interest or '',
        CUSTOM_PROPS['budget_range']:      lead.budget or '',
        CUSTOM_PROPS['buyer_status']:      lead.buyer_status or '',
        CUSTOM_PROPS['profile_stage']:     str(lead.profile_stage),
        CUSTOM_PROPS['lead_score']:        str(lead.score),
        CUSTOM_PROPS['utm_campaign']:      lead.utm_campaign or '',
        CUSTOM_PROPS['utm_source']:        lead.utm_source or '',
        CUSTOM_PROPS['utm_medium']:        lead.utm_medium or '',
        CUSTOM_PROPS['lead_source_detail']: lead.source,
    }

    if existing_id:
        logger.info(f'HubSpot: updating existing contact {existing_id} for lead {lead.id}')
        _patch(f'/crm/v3/objects/contacts/{existing_id}', {'properties': properties})
        return existing_id
    else:
        result = _post('/crm/v3/objects/contacts', {'properties': properties})
        contact_id = result['id']
        logger.info(f'HubSpot: created contact {contact_id} for lead {lead.id}')
        return contact_id


def create_deal(lead, contact_id: str) -> str:
    """
    Create a HubSpot Deal linked to the contact.
    Returns the HubSpot deal ID.
    """
    deal_name = f'{lead.first_name} {lead.last_name} — {lead.property_interest or "Property Enquiry"}'
    amount_map = {
        '₹50L – ₹1 Cr':    7500000,
        '₹1 Cr – ₹2 Cr':   15000000,
        '₹2 Cr – ₹5 Cr':   35000000,
        '₹5 Cr – ₹10 Cr':  75000000,
    }
    amount = amount_map.get(lead.budget or '', 0)

    result = _post('/crm/v3/objects/deals', {
        'properties': {
            'dealname':  deal_name,
            'dealstage': STAGE_MAP.get(lead.status, 'appointmentscheduled'),
            'pipeline':  settings.HUBSPOT_PIPELINE_ID,
            'amount':    str(amount),
            'closedate': '',
            'hubspot_owner_id': '',  # Assign to default owner; map agents in production
        },
        'associations': [{
            'to': {'id': contact_id},
            'types': [{'associationCategory': 'HUBSPOT_DEFINED', 'associationTypeId': 3}],
        }],
    })
    deal_id = result['id']
    logger.info(f'HubSpot: created deal {deal_id} for lead {lead.id}')
    return deal_id


def update_deal_stage(deal_id: str, new_status: str) -> None:
    """Update a HubSpot deal stage when lead status changes."""
    stage = STAGE_MAP.get(new_status)
    if not stage:
        logger.warning(f'HubSpot: no stage mapping for status {new_status!r}')
        return
    _patch(f'/crm/v3/objects/deals/{deal_id}', {
        'properties': {'dealstage': stage}
    })
    logger.info(f'HubSpot: updated deal {deal_id} to stage {stage}')


# ─── Webhook Verification ────────────────────────────────────────

def verify_hubspot_signature(body: bytes, signature: str, version: str = 'v3') -> bool:
    """
    Verify that an inbound webhook came from HubSpot.
    Uses HMAC-SHA256 with the app's client secret.
    """
    secret = settings.HUBSPOT_WEBHOOK_SECRET
    if version == 'v3':
        expected = hmac.new(
            secret.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    return False


def parse_hubspot_webhook(payload: list[dict]) -> list[dict]:
    """
    Parse HubSpot webhook payload into actionable events.
    Returns list of {'lead_phone': str, 'new_stage': str} dicts.
    """
    events = []
    for event in payload:
        if event.get('subscriptionType') == 'deal.propertyChange':
            if event.get('propertyName') == 'dealstage':
                # Reverse-map HubSpot stage → DigiSoft status
                hs_stage = event.get('propertyValue', '')
                reverse = {v: k for k, v in STAGE_MAP.items()}
                digisoft_status = reverse.get(hs_stage)
                if digisoft_status:
                    events.append({
                        'object_id': event.get('objectId'),
                        'new_status': digisoft_status,
                    })
    return events
