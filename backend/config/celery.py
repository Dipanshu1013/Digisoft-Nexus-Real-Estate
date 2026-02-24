"""DigiSoft Nexus — Celery Configuration"""
import os
from celery import celery_app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
app = Celery('digisoft_nexus')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
