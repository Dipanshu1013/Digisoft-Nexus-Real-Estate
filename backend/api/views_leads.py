"""
DigiSoft Nexus — Updated Lead API Views
backend/api/views_leads.py

Enhanced version of the Phase 2 lead capture endpoint.
Integrations fire automatically via Django signals (integrations/signals.py)
so this view stays clean — just validate, save, respond.

Also adds:
  - PATCH /api/leads/{id}/ — status update (triggers status-change signals)
  - GET  /api/admin/leads/ — admin list with filters (Phase 6 admin panel)
  - GET  /api/admin/leads/{id}/ — admin lead detail
"""

import logging
from django.core.cache import cache
from django.utils import timezone
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)

# ─── Serializers ─────────────────────────────────────────────────

class LeadCaptureSerializer(serializers.Serializer):
    first_name        = serializers.CharField(min_length=2, max_length=100)
    last_name         = serializers.CharField(max_length=100, default='')
    phone             = serializers.RegexField(
        r'^(\+91|0)?[6-9]\d{9}$',
        error_messages={'invalid': 'Enter a valid 10-digit Indian mobile number.'},
    )
    email             = serializers.EmailField(required=False, allow_blank=True)
    property_interest = serializers.CharField(max_length=200, required=False, allow_blank=True)
    property_slug     = serializers.SlugField(required=False, allow_blank=True)
    preferred_config  = serializers.CharField(max_length=50, required=False, allow_blank=True)
    source            = serializers.CharField(max_length=50, default='website')
    profile_stage     = serializers.IntegerField(min_value=1, max_value=4, default=1)
    consent_given     = serializers.BooleanField()
    consent_text      = serializers.CharField(max_length=1000)
    page_url          = serializers.URLField(required=False, allow_blank=True)
    utm_source        = serializers.CharField(max_length=100, required=False, allow_blank=True)
    utm_medium        = serializers.CharField(max_length=100, required=False, allow_blank=True)
    utm_campaign      = serializers.CharField(max_length=200, required=False, allow_blank=True)
    utm_content       = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def validate_consent_given(self, value):
        if not value:
            raise serializers.ValidationError('Consent is required under the Digital Personal Data Protection Act 2023.')
        return value

    def validate_phone(self, value):
        # Normalise to E.164
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) == 10:
            digits = '91' + digits
        return '+' + digits


class LeadStatusUpdateSerializer(serializers.Serializer):
    status          = serializers.ChoiceField(choices=[
        'new', 'contacted', 'site-visit', 'negotiation', 'closed-won', 'closed-lost',
    ], required=False)
    assigned_agent  = serializers.CharField(max_length=100, required=False)
    score           = serializers.IntegerField(min_value=0, max_value=100, required=False)
    note            = serializers.CharField(max_length=5000, required=False, allow_blank=True)
    note_type       = serializers.ChoiceField(
        choices=['note', 'call', 'whatsapp', 'email', 'sitevisit'],
        required=False,
        default='note',
    )
    visit_date      = serializers.CharField(max_length=20, required=False)  # e.g. "2026-03-15"
    visit_time      = serializers.CharField(max_length=10, required=False)  # e.g. "14:00"


# ─── Rate Limiting ───────────────────────────────────────────────

def _is_rate_limited(phone: str) -> bool:
    """
    Prevent duplicate lead creation within 1 hour for the same phone.
    Uses Django cache (Redis in production).
    """
    key = f'lead_capture:{phone}'
    if cache.get(key):
        return True
    cache.set(key, True, timeout=3600)  # 1 hour
    return False


def _is_score_duplicate(phone: str) -> 'Lead | None':
    """Check if a lead with this phone already exists."""
    from api.models import Lead
    return Lead.objects.filter(phone=phone).first()


# ─── Lead Capture Endpoint ───────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def capture_lead(request):
    """
    POST /api/leads/capture/

    Public endpoint used by all frontend forms (main site, microsites, popups).
    Validates input, creates or updates lead, fires integrations via signals.

    Rate limited: 1 submission per phone per hour.
    Deduplication: existing phone → update profile stage, don't create duplicate.
    """
    serializer = LeadCaptureSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {'error': 'Validation failed', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data
    phone = data['phone']

    # Rate limit check
    if _is_rate_limited(phone):
        existing = _is_score_duplicate(phone)
        if existing:
            # Update profile stage if more data was collected
            if data['profile_stage'] > existing.profile_stage:
                existing.profile_stage = data['profile_stage']
                if data.get('email') and not existing.email:
                    existing.email = data['email']
                existing.save(update_fields=['profile_stage', 'email', 'updated_at'])
            return Response(
                {'status': 'duplicate', 'lead_id': str(existing.id), 'message': 'Profile updated.'},
                status=status.HTTP_200_OK,
            )

    # Auto-calculate initial lead score
    score = _calculate_score(data)

    # Create lead
    from api.models import Lead
    lead = Lead.objects.create(
        first_name       = data['first_name'],
        last_name        = data.get('last_name', ''),
        phone            = phone,
        email            = data.get('email', ''),
        property_interest= data.get('property_interest', ''),
        property_slug    = data.get('property_slug', ''),
        preferred_config = data.get('preferred_config', ''),
        source           = data.get('source', 'website'),
        profile_stage    = data['profile_stage'],
        status           = 'new',
        score            = score,
        consent_given    = True,
        consent_text     = data['consent_text'],
        page_url         = data.get('page_url', ''),
        utm_source       = data.get('utm_source', ''),
        utm_medium       = data.get('utm_medium', ''),
        utm_campaign     = data.get('utm_campaign', ''),
        utm_content      = data.get('utm_content', ''),
        created_at       = timezone.now(),
        updated_at       = timezone.now(),
    )

    logger.info(f'Lead {lead.id} created: {lead.first_name} {lead.last_name} [{lead.source}] score={score}')

    return Response(
        {
            'status':   'created',
            'lead_id':  str(lead.id),
            'score':    score,
            'message':  'Your enquiry has been received. Our team will contact you within 30 minutes.',
        },
        status=status.HTTP_201_CREATED,
    )


def _calculate_score(data: dict) -> int:
    """
    Auto-calculate lead score (0–100) from captured data.
    Higher score = higher intent = prioritise faster.
    """
    score = 0

    # Profile completeness
    if data.get('email'):             score += 10
    if data.get('property_interest'): score += 10
    if data.get('preferred_config'):  score += 5
    if data['profile_stage'] >= 2:    score += 10
    if data['profile_stage'] >= 3:    score += 10
    if data['profile_stage'] >= 4:    score += 5

    # Source quality (paid sources = higher intent)
    source_scores = {
        'google-ads': 20, 'meta-ads': 15, 'referral': 25,
        'microsite': 15, 'campaign': 15, 'organic': 10,
        'exit-intent': 5, 'scroll-popup': 5, 'whatsapp': 20, 'walk-in': 30,
    }
    score += source_scores.get(data.get('source', 'website'), 10)

    # Campaign attribution = some intent signal
    if data.get('utm_campaign'):      score += 5

    return min(score, 100)


# ─── Lead Status Update ──────────────────────────────────────────

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_lead(request, lead_id: str):
    """
    PATCH /api/leads/{id}/

    Update lead status, agent, score, or add a note.
    Status changes trigger signals → CRM sync, WhatsApp messages.
    Only accessible to authenticated admin users.
    """
    from api.models import Lead, LeadNote

    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)

    # Role-based access: agents can only update their own leads
    user = request.user
    if hasattr(user, 'agent') and user.agent.role == 'agent':
        if str(lead.assigned_agent_id) != str(user.agent.id):
            return Response({'error': 'You can only update leads assigned to you.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = LeadStatusUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    update_fields = ['updated_at']

    if 'status' in data:
        lead.status = data['status']
        update_fields.append('status')

    if 'assigned_agent' in data:
        lead.assigned_agent_id = data['assigned_agent']
        update_fields.append('assigned_agent_id')

    if 'score' in data:
        lead.score = data['score']
        update_fields.append('score')

    lead.updated_at = timezone.now()
    lead.save(update_fields=update_fields)

    # Add note if provided
    if data.get('note'):
        LeadNote.objects.create(
            lead        = lead,
            author      = request.user,
            content     = data['note'],
            note_type   = data.get('note_type', 'note'),
        )

    logger.info(f'Lead {lead.id} updated by {request.user}: {data}')
    return Response({'status': 'updated', 'lead_id': str(lead.id)})


# ─── Admin List + Detail ─────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_leads_list(request):
    """
    GET /api/admin/leads/
    Query params: status, source, agent, search, page, page_size
    """
    from api.models import Lead
    from django.core.paginator import Paginator

    qs = Lead.objects.select_related('assigned_agent').order_by('-created_at')

    # Filters
    if s := request.GET.get('status'):
        qs = qs.filter(status=s)
    if src := request.GET.get('source'):
        qs = qs.filter(source=src)
    if agent := request.GET.get('agent'):
        qs = qs.filter(assigned_agent_id=agent)
    if q := request.GET.get('search'):
        from django.db.models import Q
        qs = qs.filter(
            Q(first_name__icontains=q) | Q(last_name__icontains=q) |
            Q(phone__icontains=q) | Q(email__icontains=q)
        )

    page_size = min(int(request.GET.get('page_size', 25)), 100)
    paginator = Paginator(qs, page_size)
    page = paginator.get_page(request.GET.get('page', 1))

    return Response({
        'count':    paginator.count,
        'pages':    paginator.num_pages,
        'results': [_lead_to_dict(l) for l in page.object_list],
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_lead_detail(request, lead_id: str):
    """GET /api/admin/leads/{id}/"""
    from api.models import Lead
    try:
        lead = Lead.objects.prefetch_related('notes', 'integrations').get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    data = _lead_to_dict(lead, detail=True)

    # Add integration sync status
    data['integrations'] = [
        {
            'platform':       rec.platform,
            'status':         rec.status,
            'external_id':    rec.external_id,
            'last_synced_at': rec.last_synced_at.isoformat() if rec.last_synced_at else None,
            'error':          rec.error_message,
        }
        for rec in lead.integrations.all()
    ]
    return Response(data)


def _lead_to_dict(lead, detail: bool = False) -> dict:
    d = {
        'id':               str(lead.id),
        'first_name':       lead.first_name,
        'last_name':        lead.last_name,
        'phone':            lead.phone,
        'email':            lead.email,
        'status':           lead.status,
        'source':           lead.source,
        'score':            lead.score,
        'profile_stage':    lead.profile_stage,
        'property_interest':lead.property_interest,
        'budget':           lead.budget,
        'assigned_agent':   str(lead.assigned_agent_id) if lead.assigned_agent_id else None,
        'created_at':       lead.created_at.isoformat(),
        'updated_at':       lead.updated_at.isoformat(),
    }
    if detail:
        d['notes'] = [
            {
                'id':           str(n.id),
                'content':      n.content,
                'type':         n.note_type,
                'author':       n.author.get_full_name() if n.author else 'System',
                'created_at':   n.created_at.isoformat(),
            }
            for n in lead.notes.order_by('-created_at')
        ]
        d['utm'] = {
            'source':   lead.utm_source,
            'medium':   lead.utm_medium,
            'campaign': lead.utm_campaign,
            'content':  lead.utm_content,
        }
    return d
