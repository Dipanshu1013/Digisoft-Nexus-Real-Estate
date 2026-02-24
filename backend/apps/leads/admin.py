from django.contrib import admin
from django.utils.html import format_html
from .models import Lead, LeadNote


class LeadNoteInline(admin.TabularInline):
    model = LeadNote
    extra = 1
    readonly_fields = ['created_at', 'author']


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'email', 'status_badge', 'source',
                    'score', 'profile_stage', 'property_interest', 'assigned_agent', 'created_at']
    list_filter = ['status', 'source', 'profile_stage', 'buyer_status', 'created_at']
    search_fields = ['first_name', 'last_name', 'phone', 'email', 'property_interest']
    readonly_fields = ['score', 'consent_timestamp', 'hubspot_contact_id', 'zoho_lead_id', 'created_at', 'updated_at']
    list_editable = ['status', 'assigned_agent']
    date_hierarchy = 'created_at'
    inlines = [LeadNoteInline]

    def status_badge(self, obj):
        colors = {
            'new': '#3b82f6', 'contacted': '#8b5cf6', 'site_visit': '#f59e0b',
            'negotiation': '#f97316', 'closed_won': '#22c55e', 'closed_lost': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    fieldsets = (
        ('Contact Info', {'fields': ('first_name', 'last_name', 'phone', 'email')}),
        ('Property Interest', {'fields': ('property_interest', 'property_slug', 'preferred_config', 'budget', 'current_city', 'buyer_status')}),
        ('Lead Quality', {'fields': ('status', 'source', 'score', 'profile_stage', 'assigned_agent')}),
        ('UTM Attribution', {'fields': ('utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'page_url')}),
        ('Compliance', {'fields': ('consent_given', 'consent_text', 'consent_timestamp')}),
        ('CRM IDs', {'fields': ('hubspot_contact_id', 'hubspot_deal_id', 'zoho_lead_id')}),
        ('Timestamps', {'fields': ('last_contacted_at', 'created_at', 'updated_at')}),
    )

    actions = ['mark_contacted', 'export_csv']

    @admin.action(description='Mark selected as Contacted')
    def mark_contacted(self, request, queryset):
        queryset.update(status='contacted')
        self.message_user(request, f'{queryset.count()} leads marked as Contacted.')

    @admin.action(description='Export to CSV')
    def export_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="leads.csv"'
        writer = csv.writer(response)
        writer.writerow(['Name', 'Phone', 'Email', 'Status', 'Source', 'Property', 'Campaign', 'Date'])
        for lead in queryset:
            writer.writerow([
                lead.full_name, lead.phone, lead.email, lead.status,
                lead.source, lead.property_interest, lead.utm_campaign,
                lead.created_at.strftime('%Y-%m-%d %H:%M')
            ])
        return response
