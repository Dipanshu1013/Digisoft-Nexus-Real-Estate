"""
DigiSoft Nexus — Meta Conversions API
backend/integrations/meta_client.py

Sends offline conversion events to Meta (Facebook) Conversions API.
This closes the attribution loop: Google/Meta ad click → lead → closed deal.

Used for:
  - Lead submitted → 'Lead' event (improves ad targeting)
  - Lead closed-won → 'Purchase' event (ROAS calculation)

All data is hashed before sending (Meta requires SHA-256 hashing of PII).
"""

import hashlib
import logging
import time
import re
from typing import Any
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

META_CONVERSIONS_URL = f'https://graph.facebook.com/v19.0/{settings.META_PIXEL_ID}/events'


def _sha256(value: str) -> str:
    """Hash a string with SHA-256 (required by Meta for PII fields)."""
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


def _clean_phone(phone: str) -> str:
    """Normalise phone: strip non-digits, ensure country code."""
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10:
        digits = '91' + digits
    return digits


def _build_user_data(lead) -> dict:
    """
    Build Meta user_data object from lead.
    All PII fields must be SHA-256 hashed.
    """
    user_data: dict[str, Any] = {
        'ph': [_sha256(_clean_phone(lead.phone))],
        'country': [_sha256('in')],
    }
    if lead.email:
        user_data['em'] = [_sha256(lead.email)]
    if lead.first_name:
        user_data['fn'] = [_sha256(lead.first_name)]
    if lead.last_name:
        user_data['ln'] = [_sha256(lead.last_name)]
    if lead.current_city:
        user_data['ct'] = [_sha256(lead.current_city.lower().replace(' ', ''))]
    return user_data


def _send_event(events: list[dict]) -> dict:
    """POST one or more events to Meta Conversions API."""
    payload: dict[str, Any] = {
        'data': events,
        'access_token': settings.META_ACCESS_TOKEN,
    }
    # Include test event code in non-production environments
    if hasattr(settings, 'META_TEST_EVENT_CODE') and settings.META_TEST_EVENT_CODE:
        payload['test_event_code'] = settings.META_TEST_EVENT_CODE

    r = requests.post(META_CONVERSIONS_URL, json=payload, timeout=10)
    r.raise_for_status()
    result = r.json()
    logger.info(f'Meta CAPI: sent {len(events)} event(s) — events_received={result.get("events_received")}')
    return result


# ─── Event Senders ───────────────────────────────────────────────

def send_lead_event(lead) -> dict:
    """
    Fire 'Lead' event when a lead is created.
    This tells Meta which ad clicks resulted in form submissions.
    """
    event = {
        'event_name': 'Lead',
        'event_time': int(time.time()),
        'action_source': 'website',
        'event_source_url': lead.page_url or 'https://digisoftnexus.com',
        'user_data': _build_user_data(lead),
        'custom_data': {
            'lead_id':           str(lead.id),
            'property_interest': lead.property_interest or '',
            'lead_source':       lead.source,
            'budget':            lead.budget or '',
        },
        # Event ID for deduplication (matches the browser pixel event if fired)
        'event_id': f'lead_{lead.id}',
    }
    try:
        return _send_event([event])
    except Exception as e:
        logger.error(f'Meta CAPI Lead event failed for lead {lead.id}: {e}')
        raise


def send_purchase_event(lead, revenue_inr: int) -> dict:
    """
    Fire 'Purchase' event when a deal is closed-won.
    This is the key event for ROAS calculation in Meta Ads Manager.

    revenue_inr: Deal value in Indian Rupees (integer).
    Meta normalises to USD using exchange rate internally.
    """
    event = {
        'event_name': 'Purchase',
        'event_time': int(time.time()),
        'action_source': 'crm',  # Not a website event — it's a CRM conversion
        'user_data': _build_user_data(lead),
        'custom_data': {
            'currency': 'INR',
            'value': revenue_inr,
            'content_name':     lead.property_interest or 'Property',
            'content_category': 'Real Estate',
            'lead_id':          str(lead.id),
            'order_id':         f'deal_{lead.id}',
        },
        'event_id': f'purchase_{lead.id}',
    }
    try:
        return _send_event([event])
    except Exception as e:
        logger.error(f'Meta CAPI Purchase event failed for lead {lead.id}: {e}')
        raise


def send_schedule_event(lead) -> dict:
    """
    Fire 'Schedule' event when a site visit is booked.
    Useful for optimising for high-intent actions.
    """
    event = {
        'event_name': 'Schedule',
        'event_time': int(time.time()),
        'action_source': 'crm',
        'user_data': _build_user_data(lead),
        'custom_data': {
            'content_name':     lead.property_interest or 'Property',
            'content_category': 'Site Visit',
            'lead_id':          str(lead.id),
        },
        'event_id': f'schedule_{lead.id}',
    }
    try:
        return _send_event([event])
    except Exception as e:
        logger.error(f'Meta CAPI Schedule event failed for lead {lead.id}: {e}')
        raise


def send_batch_events(events: list[dict]) -> dict:
    """
    Send up to 1,000 events in a single API call (Meta batch limit).
    Useful for backfilling historical conversions.
    """
    if not events:
        return {}
    # Meta limit: 1,000 events per request
    chunks = [events[i:i+1000] for i in range(0, len(events), 1000)]
    results = []
    for chunk in chunks:
        results.append(_send_event(chunk))
    return {'chunks_sent': len(chunks), 'results': results}
