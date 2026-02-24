"""
DigiSoft Nexus — Celery Configuration
backend/celery.py

Initialise Celery with Redis broker.
Import this in backend/__init__.py:
    from .celery import app as celery_app
    __all__ = ('celery_app',)
"""

import os
from backend.celery_app import Celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('digisoft_nexus')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all INSTALLED_APPS
app.autodiscover_tasks()

# ─── Celery Beat Schedule (periodic tasks) ───────────────────────
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Re-try failed integrations every 10 minutes
    'retry-failed-integrations': {
        'task': 'integrations.tasks.retry_failed_integrations',
        'schedule': crontab(minute='*/10'),
    },
    # Daily summary report to Slack at 8 AM IST
    'daily-lead-summary': {
        'task': 'integrations.tasks.send_daily_summary',
        'schedule': crontab(hour=2, minute=30),  # 2:30 UTC = 8:00 IST
    },
    # Refresh Zoho OAuth token every 50 minutes (token expires in 60 min)
    'refresh-zoho-token': {
        'task': 'integrations.tasks.refresh_zoho_token',
        'schedule': crontab(minute='*/50'),
    },
}

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Kolkata',
    enable_utc=True,
    task_acks_late=True,              # Re-queue on worker crash
    task_reject_on_worker_lost=True,  # Re-queue if worker dies
    worker_prefetch_multiplier=1,     # Fair task distribution
    task_routes={
        'integrations.tasks.push_to_hubspot': {'queue': 'integrations'},
        'integrations.tasks.push_to_zoho': {'queue': 'integrations'},
        'integrations.tasks.send_whatsapp_*': {'queue': 'messaging'},
        'integrations.tasks.push_meta_*': {'queue': 'integrations'},
        'integrations.tasks.send_daily_summary': {'queue': 'reporting'},
    },
    # Retry configuration
    task_default_retry_delay=60,      # 60 seconds between retries
    task_max_retries=3,
    task_soft_time_limit=30,          # 30s soft limit per task
    task_time_limit=60,               # 60s hard limit
)
