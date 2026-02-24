"""
DigiSoft Real Estate — Property API Views
Full CRUD + filtering + ISR-compatible endpoints
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as df_filters
from .models import Property, Developer, PropertyImage
from rest_framework import serializers


# ==========================================
# SERIALIZERS
# ==========================================
class DeveloperSerializer(serializers.ModelSerializer):
    property_count = serializers.SerializerMethodField()

    class Meta:
        model  = Developer
        fields = ['id', 'slug', 'name', 'logo', 'description', 'established_year',
                  'website', 'rera_id', 'is_featured', 'property_count']

    def get_property_count(self, obj):
        return obj.properties.filter(status='available').count()


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model  = PropertyImage
        fields = ['id', 'url', 'alt_text', 'image_type', 'is_primary', 'order']

    def get_url(self, obj):
        return obj.url


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views (ISR-cached)"""
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    developer_slug = serializers.CharField(source='developer.slug', read_only=True)
    primary_image  = serializers.SerializerMethodField()

    class Meta:
        model  = Property
        fields = [
            'id', 'slug', 'title', 'developer_name', 'developer_slug',
            'location', 'city', 'price_min', 'price_max', 'price_display',
            'bhk_options', 'area_min', 'area_max', 'property_type',
            'possession_status', 'status', 'is_featured', 'is_new', 'is_luxury',
            'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            return {'url': img.url, 'alt': img.alt_text}
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail view"""
    developer      = DeveloperSerializer(read_only=True)
    images         = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model  = Property
        fields = '__all__'


# ==========================================
# FILTERS
# ==========================================
class PropertyFilter(df_filters.FilterSet):
    city             = df_filters.CharFilter(lookup_expr='iexact')
    developer_slug   = df_filters.CharFilter(field_name='developer__slug')
    price_min        = df_filters.NumberFilter(field_name='price_min', lookup_expr='gte')
    price_max        = df_filters.NumberFilter(field_name='price_max', lookup_expr='lte')
    possession_status = df_filters.CharFilter(lookup_expr='exact')
    property_type    = df_filters.CharFilter(lookup_expr='exact')
    is_luxury        = df_filters.BooleanFilter()
    is_affordable    = df_filters.BooleanFilter()
    status           = df_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model  = Property
        fields = ['city', 'developer_slug', 'price_min', 'price_max',
                  'possession_status', 'property_type', 'is_luxury',
                  'is_affordable', 'status']


# ==========================================
# VIEWSETS
# ==========================================
class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET  /api/properties/         → paginated list (ISR-compatible)
    GET  /api/properties/{slug}/  → detail
    GET  /api/properties/featured/→ featured only
    GET  /api/properties/developer/{slug}/ → by developer
    POST /api/properties/{slug}/view/ → increment view counter
    """
    queryset         = Property.objects.select_related('developer').prefetch_related('images').filter(status='available')
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class  = PropertyFilter
    search_fields    = ['title', 'location', 'city', 'developer__name', 'description']
    ordering_fields  = ['price_min', 'price_max', 'created_at', 'view_count']
    ordering         = ['-is_featured', '-created_at']
    lookup_field     = 'slug'
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PropertyDetailSerializer
        return PropertyListSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.queryset.filter(is_featured=True)[:6]
        serializer = PropertyListSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='developer/(?P<developer_slug>[^/.]+)')
    def by_developer(self, request, developer_slug=None):
        qs = self.queryset.filter(developer__slug=developer_slug)
        page = self.paginate_queryset(qs)
        serializer = PropertyListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        """Increment view count (called from Next.js on page load)"""
        Property.objects.filter(slug=slug).update(view_count=__import__('django.db.models', fromlist=['F']).F('view_count') + 1)
        return Response({'success': True})


class DeveloperViewSet(viewsets.ReadOnlyModelViewSet):
    queryset     = Developer.objects.all()
    serializer_class = DeveloperSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
