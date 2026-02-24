"""DigiSoft Nexus — Master Django Settings (Phases 1-9)"""
import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from decouple import config, Csv
except ImportError:
    def config(key, default=None, cast=None):
        val = os.environ.get(key, default)
        if cast and val is not None:
            if cast == bool:
                return str(val).lower() in ('true', '1', 'yes')
            return cast(val)
        return val
    def Csv(): return lambda v: [x.strip() for x in v.split(',')]

SECRET_KEY = config('DJANGO_SECRET_KEY', default='dev-secret-change-in-production-digisoft-2026')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'api.digisoftnexus.com',
                 config('RAILWAY_STATIC_URL', default='')]

INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth',
    'django.contrib.contenttypes', 'django.contrib.sessions',
    'django.contrib.messages', 'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'rest_framework', 'corsheaders',
    'rest_framework_simplejwt', 'rest_framework_simplejwt.token_blacklist',
    'django_filters', 'django_celery_beat', 'django_celery_results',
    'apps.leads', 'apps.campaigns', 'apps.properties', 'apps.blog',
    'integrations',
]
try:
    import channels
    INSTALLED_APPS.append('channels')
except ImportError:
    pass

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'], 'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]}}]

DATABASES = {'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': config('POSTGRES_DB', default='digisoft_nexus'),
    'USER': config('POSTGRES_USER', default='digisoft_user'),
    'PASSWORD': config('POSTGRES_PASSWORD', default='DigiSoft@2026'),
    'HOST': config('POSTGRES_HOST', default='localhost'),
    'PORT': config('POSTGRES_PORT', default='5432'),
    'CONN_MAX_AGE': 600,
}}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000', 'http://localhost:3010',
    'https://digisoftnexus.com', 'https://admin.digisoftnexus.com',
    'https://godrej.digisoftnexus.com', 'https://dlf.digisoftnexus.com',
    'https://m3m.digisoftnexus.com',
]
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticatedOrReadOnly'],
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle', 'rest_framework.throttling.UserRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {'anon': '100/minute', 'user': '1000/minute', 'lead_capture': '10/hour'},
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend', 'rest_framework.filters.SearchFilter'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': config('JWT_SECRET_KEY', default=SECRET_KEY),
}

CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/1')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Kolkata'

REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')

CACHES = {'default': {
    'BACKEND': 'django.core.cache.backends.redis.RedisCache',
    'LOCATION': REDIS_URL,
    'TIMEOUT': 300,
    'KEY_PREFIX': 'digisoft',
}}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@digisoftnexus.com'

# Integration keys
HUBSPOT_ACCESS_TOKEN = config('HUBSPOT_ACCESS_TOKEN', default='')
HUBSPOT_PORTAL_ID = config('HUBSPOT_PORTAL_ID', default='')
HUBSPOT_PIPELINE_ID = config('HUBSPOT_PIPELINE_ID', default='default')
HUBSPOT_WEBHOOK_SECRET = config('HUBSPOT_WEBHOOK_SECRET', default='')
ZOHO_CLIENT_ID = config('ZOHO_CLIENT_ID', default='')
ZOHO_CLIENT_SECRET = config('ZOHO_CLIENT_SECRET', default='')
ZOHO_REFRESH_TOKEN = config('ZOHO_REFRESH_TOKEN', default='')
WA_PHONE_NUMBER_ID = config('WA_PHONE_NUMBER_ID', default='')
WA_ACCESS_TOKEN = config('WA_ACCESS_TOKEN', default='')
WA_VERIFY_TOKEN = config('WA_VERIFY_TOKEN', default='wa-verify')
WA_TEMPLATE_WELCOME = config('WA_TEMPLATE_WELCOME', default='lead_welcome_v1')
WA_TEMPLATE_FOLLOWUP = config('WA_TEMPLATE_FOLLOWUP', default='lead_followup_v1')
WA_TEMPLATE_SITEVISIT = config('WA_TEMPLATE_SITEVISIT', default='site_visit_confirm_v1')
WA_TEMPLATE_WIN = config('WA_TEMPLATE_WIN', default='deal_congratulations_v1')
META_PIXEL_ID = config('META_PIXEL_ID', default='')
META_ACCESS_TOKEN = config('META_ACCESS_TOKEN', default='')
META_TEST_EVENT_CODE = config('META_TEST_EVENT_CODE', default='')
HCAPTCHA_SECRET_KEY = config('HCAPTCHA_SECRET_KEY', default='0x0000000000000000000000000000000000000000')
GA4_MEASUREMENT_ID = config('GA4_MEASUREMENT_ID', default='')
GA4_API_SECRET = config('GA4_API_SECRET', default='')
SLACK_WEBHOOK_URL = config('SLACK_WEBHOOK_URL', default='')
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')

if DEBUG:
    try:
        import debug_toolbar
        INSTALLED_APPS.append('debug_toolbar')
        MIDDLEWARE.append('debug_toolbar.middleware.DebugToolbarMiddleware')
        INTERNAL_IPS = ['127.0.0.1']
    except ImportError:
        pass

