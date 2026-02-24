"""
DigiSoft Nexus — Django Admin for Integration Monitoring
backend/integrations/admin.py

Provides visibility into integration sync state from Django admin.
Accessible at /admin/ with superuser credentials.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import LeadIntegrationRecord, FailedIntegrationLog, ZohoTokenCache, WhatsAppMessageLog


@admin.register(LeadIntegrationRecord)
class LeadIntegrationRecordAdmin(admin.ModelAdmin):
    list_display   = ['lead_link', 'platform', 'status_badge', 'external_id_link', 'sync_count', 'last_synced_at']
    list_filter    = ['platform', 'status']
    search_fields  = ['lead__first_name', 'lead__last_name', 'lead__phone', 'external_id']
    readonly_fields = ['lead', 'platform', 'external_id', 'sync_count', 'created_at', 'updated_at']
    ordering       = ['-updated_at']

    def lead_link(self, obj):
        url = reverse('admin:api_lead_change', args=[obj.lead_id])
        return format_html('<a href="{}">{} {}</a>', url, obj.lead.first_name, obj.lead.last_name)
    lead_link.short_description = 'Lead'

    def status_badge(self, obj):
        colors = {
            'success': '#22c55e',
            'failed':  '#ef4444',
            'pending': '#f59e0b',
            'skipped': '#94a3b8',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:2px 8px; border-radius:4px; font-size:11px">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'

    def external_id_link(self, obj):
        if not obj.external_id:
            return '—'
        if obj.platform == 'hubspot':
            url = f'https://app.hubspot.com/contacts/{obj.external_id}'
        elif obj.platform == 'zoho':
            url = f'https://crm.zoho.in/crm/org{{}}/tab/Leads/{obj.external_id}'
        else:
            return obj.external_id
        return format_html('<a href="{}" target="_blank">{}</a>', url, obj.external_id)
    external_id_link.short_description = 'External ID'


@admin.register(FailedIntegrationLog)
class FailedIntegrationLogAdmin(admin.ModelAdmin):
    list_display   = ['lead_name', 'platform', 'task_name', 'attempts', 'resolved', 'created_at', 'retry_action']
    list_filter    = ['platform', 'resolved']
    search_fields  = ['lead__first_name', 'lead__last_name', 'lead__phone']
    readonly_fields = ['lead', 'platform', 'task_name', 'task_kwargs', 'error_message', 'attempts', 'created_at']
    ordering       = ['-created_at']
    actions        = ['retry_selected']

    def lead_name(self, obj):
        return f'{obj.lead.first_name} {obj.lead.last_name}'
    lead_name.short_description = 'Lead'

    def retry_action(self, obj):
        if not obj.resolved:
            return format_html(
                '<a class="button" href="{}?retry={}">Retry</a>',
                reverse('admin:integrations_failedintegrationlog_changelist'),
                obj.pk,
            )
        return '✓ Resolved'
    retry_action.short_description = 'Action'

    @admin.action(description='Retry selected failed integrations')
    def retry_selected(self, request, queryset):
        retried = 0
        for entry in queryset.filter(resolved=False):
            try:
                entry.retry()
                retried += 1
            except Exception:
                pass
        self.message_user(request, f'{retried} integration(s) re-queued.')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('lead')


@admin.register(WhatsAppMessageLog)
class WhatsAppMessageLogAdmin(admin.ModelAdmin):
    list_display  = ['lead_name', 'message_type', 'template_name', 'status_badge', 'wa_message_id', 'sent_at']
    list_filter   = ['message_type', 'status']
    search_fields = ['lead__first_name', 'lead__last_name', 'lead__phone', 'wa_message_id']
    readonly_fields = ['lead', 'message_type', 'template_name', 'wa_message_id', 'status', 'sent_at', 'error']
    ordering      = ['-sent_at']

    def lead_name(self, obj):
        return f'{obj.lead.first_name} {obj.lead.last_name} ({obj.lead.phone})'
    lead_name.short_description = 'Lead'

    def status_badge(self, obj):
        colors = {
            'sent':      '#3b82f6',
            'delivered': '#22c55e',
            'read':      '#8b5cf6',
            'failed':    '#ef4444',
            'opted_out': '#f59e0b',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:2px 8px; border-radius:4px; font-size:11px">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'


@admin.register(ZohoTokenCache)
class ZohoTokenCacheAdmin(admin.ModelAdmin):
    list_display  = ['token_preview', 'expires_at', 'is_valid', 'updated_at']
    readonly_fields = ['access_token', 'expires_at', 'updated_at']

    def token_preview(self, obj):
        return obj.access_token[:12] + '…'
    token_preview.short_description = 'Token (preview)'

    def is_valid(self, obj):
        from django.utils import timezone
        valid = obj.expires_at > timezone.now()
        color = '#22c55e' if valid else '#ef4444'
        label = 'Valid' if valid else 'Expired'
        return format_html('<span style="color:{}">{}</span>', color, label)
    is_valid.short_description = 'Status'
