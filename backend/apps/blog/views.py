from rest_framework import generics, serializers, filters
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db.models import F
from .models import BlogPost, BlogCategory


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    author_name = serializers.CharField(source='author.full_name', read_only=True, default='DigiSoft Team')

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'category_name', 'author_name',
                  'excerpt', 'cover_image', 'read_time_minutes', 'views_count',
                  'is_featured', 'published_at', 'tags']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True, default='DigiSoft Team')

    class Meta:
        model = BlogPost
        fields = '__all__'


class BlogListView(generics.ListAPIView):
    """GET /api/blog/ — Public blog listing"""
    serializer_class = BlogPostListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'tags']
    ordering_fields = ['published_at', 'views_count']

    def get_queryset(self):
        qs = BlogPost.objects.filter(status='published').select_related('category', 'author')
        if cat := self.request.query_params.get('category'):
            qs = qs.filter(category__slug=cat)
        return qs


class BlogDetailView(generics.RetrieveAPIView):
    """GET /api/blog/{slug}/ — Public blog post"""
    serializer_class = BlogPostDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(status='published').select_related('category', 'author')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        BlogPost.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        return super().retrieve(request, *args, **kwargs)


class AdminBlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = BlogPost.objects.all().select_related('category', 'author')


class AdminBlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    queryset = BlogPost.objects.all()
