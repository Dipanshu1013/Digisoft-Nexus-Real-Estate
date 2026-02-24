from rest_framework import serializers
from .models import Property, Developer


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'slug', 'logo', 'description',
                  'established_year', 'projects_delivered']


class PropertyListSerializer(serializers.ModelSerializer):
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    developer_slug = serializers.CharField(source='developer.slug', read_only=True)
    price_range_display = serializers.ReadOnlyField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'slug', 'developer_name', 'developer_slug',
                  'status', 'property_type', 'price_min', 'price_max',
                  'price_range_display', 'location', 'city', 'sector',
                  'bhk_types', 'cover_image', 'short_description',
                  'is_featured', 'is_luxury', 'rera_number', 'leads_count']


class PropertyDetailSerializer(serializers.ModelSerializer):
    developer = DeveloperSerializer(read_only=True)
    price_range_display = serializers.ReadOnlyField()

    class Meta:
        model = Property
        fields = '__all__'
