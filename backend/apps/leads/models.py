"""
DigiSoft Real Estate — Lead Capture Models
Core of the affiliate attribution system
"""
from django.db import models
from django.utils import timezone


class CapturedLead(models.Model):
    """
    Central lead model — stores progressive profiling data
    with full UTM attribution for affiliate tracking.
    """
    class LeadStatus(models.TextChoices):
        NEW          = 'new',          'New'
        CONTACTED    = 'contacted',    'Contacted'
        QUALIFIED    = 'qualified',    'Qualified'
        SITE_VISITED = 'site_visited', 'Site Visited'
        NEGOTIATING  = 'negotiating',  'Negotiating'
        CONVERTED    = 'converted',    'Converted'
        LOST         = 'lost',         'Lost'

    class BuyerStatus(models.TextChoices):
        BUYER    = 'buyer',    'End User / Buyer'
        INVESTOR = 'investor', 'Investor'
        RENTER   = 'renter',   'Renter'
        NRI      = 'nri',      'NRI Buyer'

    # ---- Stage 1: Awareness ----
    first_name     = models.CharField(max_length=100)
    email          = models.EmailField(db_index=True)

    # ---- Stage 2: Interest ----
    phone          = models.CharField(max_length=20, blank=True, db_index=True)
    buyer_status   = models.CharField(max_length=20, choices=BuyerStatus.choices, blank=True)

    # ---- Stage 3: Consideration ----
    budget_min     = models.BigIntegerField(null=True, blank=True)
    budget_max     = models.BigIntegerField(null=True, blank=True)
    job_title      = models.CharField(max_length=100, blank=True)

    # ---- Stage 4: Intent ----
    current_city          = models.CharField(max_length=100, blank=True)
    specific_requirements = models.TextField(blank=True)

    # ---- Attribution (UTM) ----
    property_interest = models.CharField(max_length=255, blank=True, db_index=True)
    utm_source        = models.CharField(max_length=100, blank=True, db_index=True)
    utm_medium        = models.CharField(max_length=100, blank=True)
    utm_campaign      = models.CharField(max_length=200, blank=True, db_index=True)
    utm_content       = models.CharField(max_length=200, blank=True)
    utm_term          = models.CharField(max_length=200, blank=True)

    # ---- Campaign FK ----
    campaign = models.ForeignKey(
        'campaigns.AffiliateCampaign',
        on_delete=models.SET_NULL, null=True, blank=True,
        related_name='leads'
    )

    # ---- Consent (DPDP Act 2023 compliance) ----
    consent_given   = models.BooleanField(default=False)
    consent_text    = models.TextField(blank=True)  # Store the exact consent text shown
    consent_at      = models.DateTimeField(null=True, blank=True)

    # ---- CRM Sync Status ----
    crm_synced      = models.BooleanField(default=False, db_index=True)
    hubspot_id      = models.CharField(max_length=50, blank=True)
    zoho_id         = models.CharField(max_length=50, blank=True)
    whatsapp_sent   = models.BooleanField(default=False)

    # ---- Lead Management ----
    status          = models.CharField(max_length=20, choices=LeadStatus.choices, default=LeadStatus.NEW)
    profile_stage   = models.PositiveSmallIntegerField(default=1)  # 1–4 progressive profiling stage
    assigned_to     = models.CharField(max_length=100, blank=True)  # Agent name/ID
    notes           = models.TextField(blank=True)

    # ---- Meta ----
    ip_address      = models.GenericIPAddressField(null=True, blank=True)
    user_agent      = models.TextField(blank=True)
    page_url        = models.URLField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Captured Lead'
        verbose_name_plural = 'Captured Leads'
        indexes = [
            models.Index(fields=['email', 'created_at']),
            models.Index(fields=['utm_campaign', 'status']),
            models.Index(fields=['crm_synced', 'created_at']),
        ]

    def __str__(self):
        return f"{self.first_name} — {self.email} ({self.status})"

    def save(self, *args, **kwargs):
        if self.consent_given and not self.consent_at:
            self.consent_at = timezone.now()
        super().save(*args, **kwargs)
