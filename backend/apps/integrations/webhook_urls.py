from django.urls import path
from . import webhook_views

urlpatterns = [
    path('hubspot/', webhook_views.hubspot_webhook, name='webhook-hubspot'),
    path('whatsapp/', webhook_views.whatsapp_webhook, name='webhook-whatsapp'),
    path('meta/leads/', webhook_views.meta_leads_webhook, name='webhook-meta-leads'),
]
