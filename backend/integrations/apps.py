"""
DigiSoft Nexus — Integrations App Config
backend/integrations/apps.py
"""

from django.apps import AppConfig


class IntegrationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'integrations'
    verbose_name = 'CRM Integrations'

    def ready(self) -> None:
        """Import signals to register them when Django starts."""
        import integrations.signals  # noqa: F401
