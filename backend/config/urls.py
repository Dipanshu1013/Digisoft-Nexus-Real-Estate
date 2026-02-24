from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/leads/',      include('apps.leads.urls')),
    path('api/properties/', include('apps.properties.urls')),
    path('api/campaigns/',  include('apps.campaigns.urls')),
    path('api/blog/',       include('apps.blog.urls')),
    path('api/auth/',       include('apps.users.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
