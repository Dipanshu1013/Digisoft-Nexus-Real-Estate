from django.contrib import admin
from .models import Property, Developer


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'established_year', 'projects_delivered', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'developer', 'status', 'price_range_display',
                    'city', 'is_featured', 'views_count', 'leads_count']
    list_filter = ['status', 'property_type', 'developer', 'city', 'is_featured', 'is_luxury']
    search_fields = ['title', 'location', 'rera_number']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['views_count', 'leads_count', 'created_at', 'updated_at']
    list_editable = ['is_featured', 'status']
    fieldsets = (
        ('Basic Info', {'fields': ('title', 'slug', 'developer', 'status', 'property_type', 'short_description', 'description')}),
        ('Pricing', {'fields': ('price_min', 'price_max', 'price_per_sqft')}),
        ('Location', {'fields': ('location', 'city', 'sector', 'pincode', 'latitude', 'longitude')}),
        ('Configuration', {'fields': ('bhk_types', 'area_min_sqft', 'area_max_sqft', 'total_units', 'total_towers', 'total_floors')}),
        ('Content', {'fields': ('highlights', 'amenities', 'nearby')}),
        ('RERA & Dates', {'fields': ('rera_number', 'rera_expiry', 'possession_date')}),
        ('Media', {'fields': ('cover_image', 'gallery_images', 'floor_plan_images', 'brochure_url', 'virtual_tour_url', 'youtube_url')}),
        ('SEO', {'fields': ('meta_title', 'meta_description', 'schema_markup')}),
        ('Flags', {'fields': ('is_featured', 'is_luxury')}),
        ('Analytics', {'fields': ('views_count', 'leads_count', 'created_at', 'updated_at')}),
    )
