"""
DigiSoft Real Estate — Affiliate Campaign Models
Handles UTM tracking, click counting, and lead attribution
"""
from django.db import models
from django.utils.text import slugify


class AffiliateCampaign(models.Model):
    class CommissionType(models.TextChoices):
        PER_LEAD   = 'per_lead',   'Fixed Per Lead'
        PERCENTAGE = 'percentage', 'Percentage of Deal'
        FIXED      = 'fixed',      'Fixed Amount'

    slug             = models.SlugField(max_length=120, unique=True, db_index=True)
    campaign_name    = models.CharField(max_length=255)
    developer        = models.CharField(max_length=100, db_index=True)
    property_slug    = models.CharField(max_length=200, blank=True)  # Links to Property
    target_url       = models.URLField(help_text="External developer URL or internal landing page")
    description      = models.TextField(blank=True)

    # UTM parameters this campaign expects
    utm_source       = models.CharField(max_length=100, blank=True)
    utm_medium       = models.CharField(max_length=100, blank=True)
    utm_campaign     = models.CharField(max_length=200, blank=True)

    is_active        = models.BooleanField(default=True, db_index=True)
    start_date       = models.DateField(null=True, blank=True)
    end_date         = models.DateField(null=True, blank=True)

    commission_type  = models.CharField(max_length=20, choices=CommissionType.choices, default=CommissionType.PER_LEAD)
    commission_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Aggregated stats (updated via signals)
    total_clicks     = models.PositiveIntegerField(default=0)
    total_leads      = models.PositiveIntegerField(default=0)

    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Affiliate Campaign'
        verbose_name_plural = 'Affiliate Campaigns'

    def __str__(self):
        return f"{self.campaign_name} ({self.developer})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.campaign_name)
        super().save(*args, **kwargs)

    @property
    def conversion_rate(self):
        if self.total_clicks == 0:
            return 0
        return round((self.total_leads / self.total_clicks) * 100, 2)


class AffiliateClick(models.Model):
    """Individual click tracking — used for conversion rate analysis."""
    campaign         = models.ForeignKey(AffiliateCampaign, on_delete=models.CASCADE, related_name='clicks')
    ip_address       = models.GenericIPAddressField(null=True, blank=True)
    user_agent       = models.TextField(blank=True)
    referrer         = models.URLField(blank=True)
    converted_to_lead = models.BooleanField(default=False)
    timestamp        = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Click → {self.campaign.campaign_name} at {self.timestamp:%Y-%m-%d %H:%M}"
