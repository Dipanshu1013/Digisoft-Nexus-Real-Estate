"""
DigiSoft Real Estate — Blog Models, Serializers, Views
SEO-optimized blog with categories, rich content, and view tracking
"""
from django.db import models
from django.utils.text import slugify
from rest_framework import viewsets, serializers, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import math


# ==========================================
# MODELS
# ==========================================
class BlogCategory(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    slug            = models.SlugField(max_length=250, unique=True, db_index=True)
    title           = models.CharField(max_length=255)
    excerpt         = models.TextField(max_length=300)
    content         = models.TextField()           # HTML / Tiptap JSON
    featured_image  = models.ImageField(upload_to='blog/images/', blank=True)
    featured_image_url = models.URLField(blank=True)
    featured_image_alt = models.CharField(max_length=255, blank=True)

    # Author (can use a simple CharField for MVP)
    author_name     = models.CharField(max_length=100, default='DigiSoft Team')
    author_avatar   = models.URLField(blank=True)

    category        = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags            = models.JSONField(default=list)

    # SEO
    meta_title      = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=170, blank=True)
    og_image        = models.URLField(blank=True)
    canonical_url   = models.URLField(blank=True)
    schema_faq      = models.JSONField(default=list, blank=True)  # [{q:..., a:...}]

    # Status
    is_published    = models.BooleanField(default=False, db_index=True)
    is_featured     = models.BooleanField(default=False)
    view_count      = models.PositiveIntegerField(default=0)

    published_at    = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title

    @property
    def read_time(self):
        word_count = len(self.content.split())
        return max(1, math.ceil(word_count / 200))

    @property
    def image_url(self):
        return self.featured_image_url or (self.featured_image.url if self.featured_image else '')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]
        super().save(*args, **kwargs)


# ==========================================
# SERIALIZERS
# ==========================================
class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = BlogCategory
        fields = ['id', 'slug', 'name', 'description']


class BlogPostListSerializer(serializers.ModelSerializer):
    category    = BlogCategorySerializer(read_only=True)
    read_time   = serializers.IntegerField(read_only=True)
    image_url   = serializers.CharField(read_only=True)

    class Meta:
        model  = BlogPost
        fields = [
            'id', 'slug', 'title', 'excerpt', 'image_url', 'featured_image_alt',
            'author_name', 'author_avatar', 'category', 'tags',
            'read_time', 'view_count', 'is_featured', 'published_at',
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category    = BlogCategorySerializer(read_only=True)
    read_time   = serializers.IntegerField(read_only=True)
    image_url   = serializers.CharField(read_only=True)

    class Meta:
        model  = BlogPost
        exclude = ['featured_image']


# ==========================================
# VIEWS
# ==========================================
class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True).select_related('category')
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['title', 'excerpt', 'tags', 'category__name']
    lookup_field     = 'slug'
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category__slug=cat)
        return qs

    @action(detail=False)
    def featured(self, request):
        qs = self.queryset.filter(is_featured=True)[:3]
        return Response(BlogPostListSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        BlogPost.objects.filter(slug=slug).update(view_count=__import__('django.db.models', fromlist=['F']).F('view_count') + 1)
        return Response({'success': True})
