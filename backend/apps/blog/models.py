"""DigiSoft Nexus — Blog Models"""
from django.db import models
from django.utils.text import slugify


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, max_length=300)
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    author = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    excerpt = models.CharField(max_length=500, blank=True)
    content = models.TextField()
    cover_image = models.URLField(blank=True)

    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=170, blank=True)

    # Related
    related_property_slugs = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)

    read_time_minutes = models.IntegerField(default=5)
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_featured']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:70]
        # Auto calculate read time
        word_count = len(self.content.split())
        self.read_time_minutes = max(1, word_count // 200)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
