"""
DigiSoft Nexus — Zoho CRM Integration
backend/integrations/zoho_client.py

Pushes leads to Zoho CRM as Leads and updates stage on status change.
Handles OAuth 2.0 token refresh (Zoho tokens expire every 60 minutes).
"""

import logging
from datetime import timedelta
import requests
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

ZOHO_BASE_URL = 'https://www.zohoapis.in/crm/v2'
ZOHO_AUTH_URL = 'https://accounts.zoho.in/oauth/v2/token'

# Map DigiSoft status → Zoho Lead Status field value
ZOHO_STATUS_MAP = {
    'new':          'New',
    'contacted':    'Contacted',
    'site-visit':   'Site Visit Scheduled',
    'negotiation':  'Negotiation',
    'closed-won':   'Converted',
    'closed-lost':  'Not Contacted',   # or 'Dead' depending on your Zoho setup
}

# Map source → Zoho Lead Source picklist value
ZOHO_SOURCE_MAP = {
    'google-ads':    'Google AdWords',
    'meta-ads':      'Facebook',
    'organic':       'Web Site',
    'referral':      'Partner',
    'campaign':      'Google AdWords',
    'microsite':     'Web Site',
    'exit-intent':   'Web Site',
    'scroll-popup':  'Web Site',
    'whatsapp':      'Chat',
    'walk-in':       'Trade Show',
}


def _refresh_token() -> str:
    """
    Use the stored refresh token to get a new Zoho access token.
    Saves to ZohoTokenCache for reuse.
    """
    from .models import ZohoTokenCache

    r = requests.post(ZOHO_AUTH_URL, data={
        'refresh_token': settings.ZOHO_REFRESH_TOKEN,
        'client_id':     settings.ZOHO_CLIENT_ID,
        'client_secret': settings.ZOHO_CLIENT_SECRET,
        'grant_type':    'refresh_token',
    }, timeout=10)
    r.raise_for_status()
    data = r.json()

    token = data['access_token']
    expires_in = data.get('expires_in', 3600)

    # Cache the token
    ZohoTokenCache.objects.update_or_create(
        defaults={
            'access_token': token,
            'expires_at': timezone.now() + timedelta(seconds=expires_in - 60),
        },
        id=1,  # Always keep a single record
    )
    logger.info('Zoho: access token refreshed')
    return token


def _get_token() -> str:
    """Return a valid access token, refreshing if expired."""
    from .models import ZohoTokenCache
    cached = ZohoTokenCache.get_valid_token()
    return cached or _refresh_token()


def _headers() -> dict:
    return {
        'Authorization': f'Zoho-oauthtoken {_get_token()}',
        'Content-Type': 'application/json',
    }


def _post_lead(data: dict) -> dict:
    r = requests.post(f'{ZOHO_BASE_URL}/Leads', headers=_headers(), json={'data': [data]}, timeout=10)
    r.raise_for_status()
    return r.json()


def _patch_lead(zoho_id: str, data: dict) -> dict:
    r = requests.patch(f'{ZOHO_BASE_URL}/Leads/{zoho_id}', headers=_headers(), json={'data': [data]}, timeout=10)
    r.raise_for_status()
    return r.json()


def _search_lead(phone: str) -> str | None:
    """Search for an existing Zoho lead by phone. Returns Zoho ID or None."""
    try:
        r = requests.get(
            f'{ZOHO_BASE_URL}/Leads/search',
            headers=_headers(),
            params={'criteria': f'Phone:equals:{phone}'},
            timeout=10,
        )
        if r.status_code == 204:  # No content — no match
            return None
        r.raise_for_status()
        data = r.json()
        records = data.get('data', [])
        return records[0]['id'] if records else None
    except Exception as e:
        logger.warning(f'Zoho search failed: {e}')
        return None


# ─── Main Operations ─────────────────────────────────────────────

def create_or_update_lead(lead) -> str:
    """
    Create (or update) a Zoho CRM Lead from a DigiSoft Lead.
    Returns the Zoho lead ID.
    """
    existing_id = _search_lead(lead.phone)

    payload = {
        'First_Name':   lead.first_name,
        'Last_Name':    lead.last_name,
        'Phone':        lead.phone,
        'Email':        lead.email or '',
        'Lead_Status':  ZOHO_STATUS_MAP.get(lead.status, 'New'),
        'Lead_Source':  ZOHO_SOURCE_MAP.get(lead.source, 'Web Site'),
        'Description':  f'Property Interest: {lead.property_interest or "N/A"}\nBudget: {lead.budget or "N/A"}',
        'City':         lead.current_city or '',
        # Custom Zoho fields (create in Zoho Settings → Fields):
        'Property_Interest': lead.property_interest or '',
        'Budget_Range':      lead.budget or '',
        'Buyer_Status':      lead.buyer_status or '',
        'Lead_Score':        lead.score,
        'Profile_Stage':     lead.profile_stage,
        'UTM_Source':        lead.utm_source or '',
        'UTM_Campaign':      lead.utm_campaign or '',
    }

    if existing_id:
        logger.info(f'Zoho: updating lead {existing_id} for DigiSoft lead {lead.id}')
        _patch_lead(existing_id, payload)
        return existing_id
    else:
        result = _post_lead(payload)
        zoho_id = result['data'][0]['details']['id']
        logger.info(f'Zoho: created lead {zoho_id} for DigiSoft lead {lead.id}')
        return zoho_id


def update_lead_status(zoho_id: str, new_status: str) -> None:
    """Update Zoho lead status when DigiSoft lead status changes."""
    zoho_status = ZOHO_STATUS_MAP.get(new_status, 'Contacted')
    _patch_lead(zoho_id, {'Lead_Status': zoho_status})
    logger.info(f'Zoho: updated lead {zoho_id} status to {zoho_status}')


def convert_lead_to_contact(zoho_id: str) -> dict:
    """
    When a lead is closed-won, convert the Zoho Lead to a Contact + Deal.
    Returns the created Contact and Deal IDs.
    """
    r = requests.post(
        f'{ZOHO_BASE_URL}/Leads/{zoho_id}/actions/convert',
        headers=_headers(),
        json={'data': [{'overwrite': True, 'notify_lead_owner': True, 'notify_new_entity_owner': True}]},
        timeout=15,
    )
    r.raise_for_status()
    data = r.json()
    converted = data.get('data', [{}])[0]
    logger.info(f'Zoho: converted lead {zoho_id} → contact {converted.get("Contacts", {}).get("id")}')
    return converted
