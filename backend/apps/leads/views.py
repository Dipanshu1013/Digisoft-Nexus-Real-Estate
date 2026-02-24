"""
DigiSoft Real Estate — Lead API Views
Handles progressive profiling form submissions with rate limiting
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.throttling import AnonRateThrottle
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
import logging

logger = logging.getLogger(__name__)


class LeadCaptureThrottle(AnonRateThrottle):
    rate = '10/hour'  # 10 submissions per IP per hour (anti-spam)


class LeadCaptureSerializer(serializers.Serializer):
    # Stage 1
    first_name    = serializers.CharField(max_length=100)
    email         = serializers.EmailField()
    # Stage 2
    phone         = serializers.CharField(max_length=20, required=False, allow_blank=True)
    buyer_status  = serializers.ChoiceField(
        choices=['buyer', 'investor', 'renter', 'nri'],
        required=False, allow_blank=True
    )
    # Stage 3
    budget_min    = serializers.IntegerField(required=False, allow_null=True)
    budget_max    = serializers.IntegerField(required=False, allow_null=True)
    job_title     = serializers.CharField(max_length=100, required=False, allow_blank=True)
    # Stage 4
    current_city          = serializers.CharField(max_length=100, required=False, allow_blank=True)
    specific_requirements = serializers.CharField(required=False, allow_blank=True)
    # Attribution
    property_interest = serializers.CharField(max_length=255, required=False, allow_blank=True)
    utm_source        = serializers.CharField(max_length=100, required=False, allow_blank=True)
    utm_medium        = serializers.CharField(max_length=100, required=False, allow_blank=True)
    utm_campaign      = serializers.CharField(max_length=200, required=False, allow_blank=True)
    utm_content       = serializers.CharField(max_length=200, required=False, allow_blank=True)
    utm_term          = serializers.CharField(max_length=200, required=False, allow_blank=True)
    campaign_slug     = serializers.SlugField(required=False, allow_blank=True)
    # Consent — MANDATORY (DPDP Act 2023)
    consent_given     = serializers.BooleanField()
    consent_text      = serializers.CharField(required=False, allow_blank=True)
    page_url          = serializers.URLField(required=False, allow_blank=True)
    profile_stage     = serializers.IntegerField(min_value=1, max_value=4, default=1)


class LeadCaptureView(APIView):
    """
    POST /api/leads/capture/
    Accepts lead form submission, validates consent, saves to DB,
    and triggers async CRM sync + WhatsApp via Celery.
    """
    throttle_classes = [LeadCaptureThrottle]
    permission_classes = []  # Public endpoint

    def post(self, request):
        serializer = LeadCaptureSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        data = serializer.validated_data

        # DPDP Act compliance check
        if not data.get('consent_given'):
            return Response(
                {'success': False, 'message': 'Consent is required to process your inquiry.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.leads.models import CapturedLead
        from apps.campaigns.models import AffiliateCampaign

        # Resolve campaign FK if slug provided
        campaign = None
        if data.get('campaign_slug'):
            campaign = AffiliateCampaign.objects.filter(
                slug=data['campaign_slug'], is_active=True
            ).first()

        # Check if lead exists (return visitor — update stage)
        existing = CapturedLead.objects.filter(email=data['email']).first()

        if existing:
            # Update progressive profile data
            for field in ['phone', 'buyer_status', 'budget_min', 'budget_max',
                          'job_title', 'current_city', 'specific_requirements']:
                val = data.get(field)
                if val:
                    setattr(existing, field, val)

            new_stage = data.get('profile_stage', 1)
            if new_stage > existing.profile_stage:
                existing.profile_stage = new_stage

            existing.save()
            lead = existing
            is_new = False
        else:
            # New lead
            lead = CapturedLead(
                first_name    = data['first_name'],
                email         = data['email'],
                phone         = data.get('phone', ''),
                buyer_status  = data.get('buyer_status', ''),
                budget_min    = data.get('budget_min'),
                budget_max    = data.get('budget_max'),
                job_title     = data.get('job_title', ''),
                current_city  = data.get('current_city', ''),
                specific_requirements = data.get('specific_requirements', ''),
                property_interest = data.get('property_interest', ''),
                utm_source    = data.get('utm_source', ''),
                utm_medium    = data.get('utm_medium', ''),
                utm_campaign  = data.get('utm_campaign', ''),
                utm_content   = data.get('utm_content', ''),
                utm_term      = data.get('utm_term', ''),
                campaign      = campaign,
                consent_given = data['consent_given'],
                consent_text  = data.get('consent_text', ''),
                page_url      = data.get('page_url', ''),
                profile_stage = data.get('profile_stage', 1),
                ip_address    = self._get_client_ip(request),
                user_agent    = request.META.get('HTTP_USER_AGENT', '')[:500],
            )
            lead.save()
            is_new = True

        logger.info(
            f"[Lead] {'Created' if is_new else 'Updated'} lead {lead.id} | "
            f"email={lead.email} | stage={lead.profile_stage} | "
            f"campaign={lead.utm_campaign}"
        )

        return Response({
            'success': True,
            'lead_id': str(lead.id),
            'is_new': is_new,
            'stage': lead.profile_stage,
            'message': 'Thank you! Our advisor will contact you shortly.'
        }, status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK)

    @staticmethod
    def _get_client_ip(request) -> str:
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')
