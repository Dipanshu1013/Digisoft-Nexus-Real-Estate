"""
DigiSoft Real Estate — Campaign API Views
UTM campaign tracking, click recording
"""
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import AffiliateCampaign, AffiliateClick


class CampaignSerializer(serializers.ModelSerializer):
    conversion_rate = serializers.FloatField(read_only=True)

    class Meta:
        model  = AffiliateCampaign
        fields = [
            'id', 'slug', 'campaign_name', 'developer', 'property_slug',
            'target_url', 'utm_source', 'utm_medium', 'utm_campaign',
            'is_active', 'start_date', 'end_date', 'total_clicks',
            'total_leads', 'conversion_rate',
        ]


class AffiliateCampaignViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AffiliateCampaign.objects.filter(is_active=True)
    serializer_class = CampaignSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def click(self, request, slug=None):
        """Record a campaign click — called when user lands on campaign page"""
        campaign = self.get_object()
        AffiliateClick.objects.create(
            campaign   = campaign,
            ip_address = request.META.get('REMOTE_ADDR'),
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:500],
            referrer   = request.data.get('referrer', ''),
        )
        AffiliateCampaign.objects.filter(id=campaign.id).update(
            total_clicks=__import__('django.db.models', fromlist=['F']).F('total_clicks') + 1
        )
        return Response({'success': True})
