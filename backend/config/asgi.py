"""ASGI config for DigiSoft Nexus — supports Django Channels (WebSockets)."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    from channels.routing import ProtocolTypeRouter, URLRouter
    from channels.auth import AuthMiddlewareStack
    application = ProtocolTypeRouter({
        'http': get_asgi_application(),
    })
except ImportError:
    application = get_asgi_application()
