from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'platform', 'status', 'leads_count', 'conversions', 'cpl', 'cvr', 'budget_utilization', 'start_date']
    list_filter = ['platform', 'status', 'developer']
    search_fields = ['name', 'utm_campaign', 'developer']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status']
    readonly_fields = ['leads_count', 'conversions', 'created_at', 'updated_at']
