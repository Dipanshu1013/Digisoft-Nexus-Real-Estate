from django.urls import path
try:
    from .models_and_views import blog_list, blog_detail
    urlpatterns = [
        path('', blog_list, name='blog-list'),
        path('<slug:slug>/', blog_detail, name='blog-detail'),
    ]
except ImportError:
    urlpatterns = []
