"""
DigiSoft Nexus — Integration Models
backend/integrations/models.py

Tracks the sync state of every lead across all external platforms.
Enables idempotent pushes, deduplication, and failure tracking.
"""

from django.db import models
from django.utils import timezone


class IntegrationPlatform(models.TextChoices):
    HUBSPOT = 'hubspot', 'HubSpot'
    ZOHO    = 'zoho',    'Zoho CRM'
    WHATSAPP = 'whatsapp', 'WhatsApp Business'
    META    = 'meta',    'Meta Conversions'
    GA4     = 'ga4',     'Google Analytics 4'
    SLACK   = 'slack',   'Slack'


class SyncStatus(models.TextChoices):
    PENDING  = 'pending',  'Pending'
    SUCCESS  = 'success',  'Success'
    FAILED   = 'failed',   'Failed'
    SKIPPED  = 'skipped',  'Skipped'


class LeadIntegrationRecord(models.Model):
    """
    One record per (lead, platform) pair.
    Tracks the external ID (e.g. HubSpot contact ID) and sync state.
    """
    lead            = models.ForeignKey('api.Lead', on_delete=models.CASCADE, related_name='integrations')
    platform        = models.CharField(max_length=20, choices=IntegrationPlatform.choices)
    external_id     = models.CharField(max_length=255, blank=True, null=True)
    status          = models.CharField(max_length=20, choices=SyncStatus.choices, default=SyncStatus.PENDING)
    last_synced_at  = models.DateTimeField(blank=True, null=True)
    error_message   = models.TextField(blank=True, null=True)
    sync_count      = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('lead', 'platform')
        indexes = [
            models.Index(fields=['platform', 'status']),
            models.Index(fields=['lead', 'platform']),
        ]
        verbose_name = 'Lead Integration Record'

    def mark_success(self, external_id: str | None = None) -> None:
        self.status = SyncStatus.SUCCESS
        self.last_synced_at = timezone.now()
        self.sync_count += 1
        self.error_message = None
        if external_id:
            self.external_id = external_id
        self.save(update_fields=['status', 'last_synced_at', 'sync_count', 'error_message', 'external_id', 'updated_at'])

    def mark_failed(self, error: str) -> None:
        self.status = SyncStatus.FAILED
        self.error_message = error[:2000]  # Truncate long tracebacks
        self.sync_count += 1
        self.save(update_fields=['status', 'error_message', 'sync_count', 'updated_at'])

    def __str__(self) -> str:
        return f'{self.lead_id} → {self.platform} [{self.status}]'


class FailedIntegrationLog(models.Model):
    """
    Dead letter queue: tasks that have exhausted all retries.
    Admin can manually re-trigger these.
    """
    lead            = models.ForeignKey('api.Lead', on_delete=models.CASCADE, related_name='failed_integrations')
    platform        = models.CharField(max_length=20, choices=IntegrationPlatform.choices)
    task_name       = models.CharField(max_length=200)
    task_kwargs     = models.JSONField(default=dict)
    error_message   = models.TextField()
    attempts        = models.PositiveSmallIntegerField(default=3)
    resolved        = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Failed Integration Log'

    def retry(self) -> None:
        """Manually re-queue the failed task."""
        from .tasks import TASK_REGISTRY
        task_fn = TASK_REGISTRY.get(self.task_name)
        if task_fn:
            task_fn.apply_async(kwargs=self.task_kwargs)
            self.resolved = True
            self.save(update_fields=['resolved'])

    def __str__(self) -> str:
        return f'FAILED: {self.platform} for lead {self.lead_id}'


class ZohoTokenCache(models.Model):
    """
    Stores the current Zoho OAuth access token.
    Refreshed every 50 minutes by Celery Beat.
    """
    access_token    = models.TextField()
    expires_at      = models.DateTimeField()
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Zoho Token Cache'

    @classmethod
    def get_valid_token(cls) -> str | None:
        record = cls.objects.first()
        if record and record.expires_at > timezone.now():
            return record.access_token
        return None

    def __str__(self) -> str:
        return f'Zoho token (expires {self.expires_at})'


class WhatsAppMessageLog(models.Model):
    """
    Tracks every WhatsApp message sent to a lead.
    Used for opt-out enforcement and conversation history.
    """
    class MessageType(models.TextChoices):
        WELCOME      = 'welcome',     'Welcome'
        FOLLOWUP     = 'followup',    'Follow-up'
        SITEVISIT    = 'sitevisit',   'Site Visit Confirm'
        WIN          = 'win',         'Deal Won'
        BROCHURE     = 'brochure',    'Brochure'
        AGENT_MANUAL = 'manual',      'Manual (by agent)'

    lead            = models.ForeignKey('api.Lead', on_delete=models.CASCADE, related_name='whatsapp_messages')
    message_type    = models.CharField(max_length=20, choices=MessageType.choices)
    template_name   = models.CharField(max_length=100, blank=True)
    wa_message_id   = models.CharField(max_length=255, blank=True, null=True)  # WhatsApp API message ID
    status          = models.CharField(max_length=20, default='sent')  # sent, delivered, read, failed
    sent_at         = models.DateTimeField(auto_now_add=True)
    error           = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-sent_at']

    def __str__(self) -> str:
        return f'WA {self.message_type} → {self.lead.phone} [{self.status}]'
