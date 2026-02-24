from django.urls import path
from . import views
from .security_views import secure_lead_capture, erase_lead_data

urlpatterns = [
    path('capture/', views.capture_lead, name='lead-capture'),
    path('secure-capture/', secure_lead_capture, name='lead-secure-capture'),
    path('<str:lead_id>/', views.update_lead, name='lead-update'),
    path('<str:lead_id>/erase/', erase_lead_data, name='lead-erase'),
    path('admin/list/', views.admin_leads_list, name='admin-leads'),
    path('admin/<str:lead_id>/', views.admin_lead_detail, name='admin-lead-detail'),
]
