"""
DigiSoft Real Estate — Property Models
Complete property database schema with SEO, media, and affiliate support
"""
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Developer(models.Model):
    slug        = models.SlugField(max_length=100, unique=True)
    name        = models.CharField(max_length=200)
    logo        = models.ImageField(upload_to='developers/logos/', blank=True)
    description = models.TextField(blank=True)
    established_year = models.PositiveIntegerField(null=True, blank=True)
    website     = models.URLField(blank=True)
    rera_id     = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Property(models.Model):
    class PropertyType(models.TextChoices):
        APARTMENT  = 'apartment',   'Apartment'
        VILLA      = 'villa',       'Villa'
        PLOT       = 'plot',        'Plot'
        COMMERCIAL = 'commercial',  'Commercial'
        PENTHOUSE  = 'penthouse',   'Penthouse'
        STUDIO     = 'studio',      'Studio'

    class PossessionStatus(models.TextChoices):
        READY_TO_MOVE   = 'ready-to-move',      'Ready to Move'
        UNDER_CONST     = 'under-construction',  'Under Construction'
        NEW_LAUNCH      = 'new-launch',          'New Launch'
        PRE_LAUNCH      = 'pre-launch',          'Pre-Launch'

    class PropertyStatus(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        SOLD      = 'sold',      'Sold Out'
        UPCOMING  = 'upcoming',  'Upcoming'

    # Core
    slug        = models.SlugField(max_length=200, unique=True, db_index=True)
    title       = models.CharField(max_length=255)
    developer   = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='properties')
    location    = models.CharField(max_length=255)       # e.g. "Sector 89, Gurugram"
    city        = models.CharField(max_length=100, db_index=True)
    sector      = models.CharField(max_length=100, blank=True)
    address     = models.TextField(blank=True)
    lat         = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    lng         = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    # Pricing
    price_min   = models.BigIntegerField(help_text='Minimum price in INR')
    price_max   = models.BigIntegerField(help_text='Maximum price in INR')
    price_display = models.CharField(max_length=100, help_text='e.g. ₹1.2 Cr onwards')

    # Configuration
    bhk_options     = models.JSONField(default=list)   # ['2BHK', '3BHK']
    area_min        = models.PositiveIntegerField(help_text='Minimum carpet area in sq ft')
    area_max        = models.PositiveIntegerField(help_text='Maximum carpet area in sq ft')
    property_type   = models.CharField(max_length=20, choices=PropertyType.choices, default=PropertyType.APARTMENT)
    total_units     = models.PositiveIntegerField(null=True, blank=True)
    total_towers    = models.PositiveIntegerField(null=True, blank=True)
    total_floors    = models.PositiveIntegerField(null=True, blank=True)

    # Status
    status              = models.CharField(max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.AVAILABLE)
    possession_status   = models.CharField(max_length=30, choices=PossessionStatus.choices, default=PossessionStatus.AVAILABLE)
    possession_date     = models.CharField(max_length=50, blank=True, help_text='e.g. Q3 2027')

    # Content
    description     = models.TextField()
    highlights      = models.JSONField(default=list)   # ['Panoramic Views', 'Smart Home']
    amenities       = models.JSONField(default=list)   # ['Swimming Pool', 'Gymnasium']
    specifications  = models.JSONField(default=dict)   # {'flooring': 'Italian marble', ...}

    # Media
    featured_image  = models.ImageField(upload_to='properties/images/', blank=True)
    floor_plan_url  = models.URLField(blank=True)
    virtual_tour_url = models.URLField(blank=True)
    brochure_url    = models.URLField(blank=True)
    video_url       = models.URLField(blank=True)

    # Legal
    rera            = models.CharField(max_length=100, blank=True)

    # Flags
    is_featured     = models.BooleanField(default=False, db_index=True)
    is_new          = models.BooleanField(default=False)
    is_luxury       = models.BooleanField(default=False, db_index=True)
    is_affordable   = models.BooleanField(default=False, db_index=True)

    # SEO
    meta_title      = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=170, blank=True)
    og_image        = models.URLField(blank=True)

    # Stats
    view_count      = models.PositiveIntegerField(default=0)
    inquiry_count   = models.PositiveIntegerField(default=0)

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name_plural = 'Properties'
        indexes = [
            models.Index(fields=['city', 'possession_status']),
            models.Index(fields=['developer', 'status']),
            models.Index(fields=['price_min', 'price_max']),
        ]

    def __str__(self):
        return f"{self.title} — {self.location}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.location}")
        if not self.meta_title:
            self.meta_title = f"{self.title} {self.location} | DigiSoft Real Estate"[:70]
        if not self.meta_description:
            self.meta_description = self.description[:160]
        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    class ImageType(models.TextChoices):
        EXTERIOR  = 'exterior',  'Exterior'
        INTERIOR  = 'interior',  'Interior'
        AMENITY   = 'amenity',   'Amenity'
        FLOORPLAN = 'floorplan', 'Floor Plan'
        AERIAL    = 'aerial',    'Aerial View'

    property    = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image       = models.ImageField(upload_to='properties/gallery/')
    image_url   = models.URLField(blank=True)        # External URL (Unsplash, etc.)
    alt_text    = models.CharField(max_length=255)
    image_type  = models.CharField(max_length=20, choices=ImageType.choices, default=ImageType.EXTERIOR)
    is_primary  = models.BooleanField(default=False)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', '-is_primary']

    def __str__(self):
        return f"{self.property.title} — {self.image_type}"

    @property
    def url(self):
        return self.image_url or (self.image.url if self.image else '')
