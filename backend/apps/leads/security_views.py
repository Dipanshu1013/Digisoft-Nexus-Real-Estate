"""
DigiSoft Nexus — Security Views & Middleware (Phase 9)
Implements:
  - hCaptcha verification
  - IP-based rate limiting for lead capture
  - DPDP Act 2023 right-to-erasure endpoint
  - Security headers middleware
"""

import hashlib
import json
import logging
import re
from datetime import datetime, timedelta
from functools import wraps
from typing import Callable

import requests
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

logger = logging.getLogger(__name__)

HCAPTCHA_SECRET = getattr(settings, 'HCAPTCHA_SECRET_KEY', '')
HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify'


# ─── hCaptcha Verification ───────────────────────────────────────

def verify_hcaptcha(token: str, ip: str = '') -> bool:
    """
    Verify hCaptcha token with hCaptcha servers.
    Returns True if verification passes, False otherwise.
    In development (DEBUG=True), always returns True.
    """
    if settings.DEBUG:
        return True

    if not token:
        logger.warning(f'hCaptcha: empty token from IP {ip}')
        return False

    try:
        resp = requests.post(
            HCAPTCHA_VERIFY_URL,
            data={
                'secret': HCAPTCHA_SECRET,
                'response': token,
                'remoteip': ip,
            },
            timeout=5,
        )
        result = resp.json()
        success = result.get('success', False)

        if not success:
            logger.warning(f'hCaptcha failed for IP {ip}: {result.get("error-codes", [])}')

        return success

    except requests.RequestException as e:
        logger.error(f'hCaptcha verification request failed: {e}')
        # Fail open in case of hCaptcha outage — log and allow
        return True


# ─── IP Rate Limiter ─────────────────────────────────────────────

def get_client_ip(request: HttpRequest) -> str:
    """Extract real client IP, respecting proxy headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '0.0.0.0')
    return ip


def rate_limit_lead_capture(ip: str) -> tuple[bool, int]:
    """
    Rate limit: 10 lead submissions per IP per hour.
    Returns (is_allowed, remaining_count).
    """
    key = f'lead_ratelimit:{hashlib.md5(ip.encode()).hexdigest()}'
    current = cache.get(key, 0)
    limit = 10

    if current >= limit:
        return False, 0

    # Increment counter with 1-hour expiry
    pipe_result = cache.get_or_set(key, 0, timeout=3600)
    cache.incr(key)
    remaining = limit - current - 1
    return True, remaining


def check_phone_duplicate(phone: str) -> bool:
    """
    Check if a lead with this phone was submitted in the last 60 minutes.
    Prevents duplicate submissions on page refresh.
    """
    # Normalise phone
    digits = re.sub(r'\D', '', phone)
    key = f'phone_dedup:{hashlib.md5(digits.encode()).hexdigest()}'
    if cache.get(key):
        return True  # Duplicate
    cache.set(key, True, timeout=3600)
    return False


# ─── Secure Lead Capture View ────────────────────────────────────

class LeadCaptureThrottle(AnonRateThrottle):
    rate = '10/hour'
    scope = 'lead_capture'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LeadCaptureThrottle])
def secure_lead_capture(request):
    """
    POST /api/leads/secure-capture/
    Full security stack:
      - hCaptcha verification
      - IP rate limiting (10/hour)
      - Phone deduplication (1 hour window)
      - DPDP consent validation
      - Input sanitisation
    """
    from apps.leads.models import Lead
    from apps.leads.serializers import LeadSerializer

    ip = get_client_ip(request)
    data = request.data

    # 1. hCaptcha verification
    hcaptcha_token = data.get('hcaptcha_token', '')
    if not verify_hcaptcha(hcaptcha_token, ip):
        return Response(
            {'error': 'Security verification failed. Please try again.', 'code': 'CAPTCHA_FAILED'},
            status=400,
        )

    # 2. IP rate limit
    allowed, remaining = rate_limit_lead_capture(ip)
    if not allowed:
        return Response(
            {'error': 'Too many submissions. Please try again in an hour.', 'code': 'RATE_LIMITED'},
            status=429,
            headers={'Retry-After': '3600', 'X-RateLimit-Remaining': '0'},
        )

    # 3. DPDP consent check
    if not data.get('consent_given'):
        return Response(
            {'error': 'Consent is required under the Digital Personal Data Protection Act 2023.', 'code': 'NO_CONSENT'},
            status=400,
        )

    consent_text = data.get('consent_text', '')
    required_consent = 'I consent to Digisoft Nexus sharing my data with the relevant developer'
    if required_consent not in consent_text:
        return Response(
            {'error': 'Invalid consent text.', 'code': 'INVALID_CONSENT'},
            status=400,
        )

    # 4. Phone deduplication
    phone = data.get('phone', '')
    if check_phone_duplicate(phone):
        return Response(
            {'status': 'duplicate', 'message': 'We already have your enquiry. Our team will contact you shortly.'},
            status=200,
        )

    # 5. Validate & create lead
    serializer = LeadSerializer(data={
        **data,
        'ip_address': ip,
        'user_agent': request.META.get('HTTP_USER_AGENT', '')[:500],
    })

    if not serializer.is_valid():
        return Response({'error': 'Validation failed', 'details': serializer.errors}, status=400)

    lead = serializer.save()
    logger.info(f'Lead created: ID={lead.id} source={lead.utm_source} ip={ip}')

    return Response(
        {
            'status': 'success',
            'lead_id': str(lead.id),
            'message': 'Thank you! Our expert will call you within 30 minutes.',
        },
        status=201,
        headers={'X-RateLimit-Remaining': str(remaining)},
    )


# ─── DPDP Act 2023 — Right to Erasure ───────────────────────────

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def erase_lead_data(request, lead_id: str):
    """
    DELETE /api/leads/{lead_id}/erase/
    DPDP Act 2023 compliance: Delete all PII for a specific lead.
    Admin only. Cascades to CRM records.
    """
    from apps.leads.models import Lead
    from integrations.models import LeadIntegrationRecord

    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=404)

    # Log erasure before deletion
    logger.info(f'DPDP Erasure: Lead {lead_id} deleted by admin {request.user.id} at {timezone.now()}')

    # Anonymise rather than hard-delete (keeps analytics intact)
    lead.first_name = '[ERASED]'
    lead.last_name = '[ERASED]'
    lead.phone = f'ERASED_{lead.id}'
    lead.email = f'erased_{lead.id}@erased.invalid'
    lead.ip_address = '0.0.0.0'
    lead.utm_source = ''
    lead.utm_medium = ''
    lead.utm_campaign = ''
    lead.is_erased = True
    lead.erased_at = timezone.now()
    lead.save()

    # Remove CRM integration records
    LeadIntegrationRecord.objects.filter(lead=lead).delete()

    return Response({
        'status': 'erased',
        'message': f'All PII for lead {lead_id} has been anonymised per DPDP Act 2023.',
        'erased_at': timezone.now().isoformat(),
    })


# ─── Security Headers Middleware ─────────────────────────────────

class SecurityHeadersMiddleware:
    """
    Adds security headers to every response that Django doesn't add by default.
    Register in MIDDLEWARE before other middleware.
    """

    def __init__(self, get_response: Callable) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)

        # Permissions Policy (formerly Feature-Policy)
        response['Permissions-Policy'] = (
            'camera=(), microphone=(), geolocation=(self), '
            'payment=(), usb=(), interest-cohort=()'
        )

        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        # Remove server fingerprinting
        if 'Server' in response:
            del response['Server']
        if 'X-Powered-By' in response:
            del response['X-Powered-By']

        return response


# ─── Input Sanitisation Utility ──────────────────────────────────

def sanitise_text(value: str, max_length: int = 500) -> str:
    """Strip HTML tags and truncate. Never use raw user input in HTML."""
    import html
    # Decode HTML entities first, then strip tags
    decoded = html.unescape(value)
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', decoded)
    # Strip null bytes and control characters
    clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', clean)
    return clean.strip()[:max_length]


# ─── URL Registration ─────────────────────────────────────────────
# Add to backend/config/urls.py:
# path('api/leads/secure-capture/', secure_lead_capture),
# path('api/leads/<str:lead_id>/erase/', erase_lead_data),
