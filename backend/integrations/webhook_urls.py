"""Webhook URL patterns for inbound integrations."""
from django.urls import path
from .webhooks.views import hubspot_webhook, whatsapp_webhook, meta_leads_webhook

urlpatterns = [
    path('hubspot/', hubspot_webhook, name='webhook-hubspot'),
    path('whatsapp/', whatsapp_webhook, name='webhook-whatsapp'),
    path('meta/leads/', meta_leads_webhook, name='webhook-meta-leads'),
]
