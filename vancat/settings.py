from decimal import Decimal
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

env_file = BASE_DIR / '.env'
if env_file.exists():
    env.read_env(str(env_file))
SECRET_KEY = 'django-insecure-7u3+n@f@x^1=zr1w8v8pct%r)(k9m(bm6xz3p8jd_n+3@qrpl%'
DEBUG = env.bool('DJANGO_DEBUG', True)
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['*'])
REDIS_URL = env.str('REDIS_URL', 'redis://localhost:6379/1')


# Application definition

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',

    'sorl.thumbnail',
    'dbsettings',
    'constance',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'spa.middleware.SPAMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'vancat.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'vancat.wsgi.application'

DATABASES = {
    'default': env.db('DATABASE_URL', default='sqlite:///db.sqlite3'),
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_L10N = False
USE_TZ = True

STATICFILES_DIRS = [
    BASE_DIR / 'frontend/build',
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {},
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{',
        }
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        },
        'django.server': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.server': {
            'handlers': ['django.server'],
            'level': 'INFO',
            'propagate': False,
        },
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

PUBLIC_ROOT = BASE_DIR / 'public'
STATIC_URL = '/static/'
STATIC_ROOT = PUBLIC_ROOT / 'static'
MEDIA_URL = '/uploads/'
MEDIA_ROOT = PUBLIC_ROOT / 'uploads'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GRAPHENE = {
    'SCHEMA': 'app.schema.schema',
    'MIDDLEWARE': [
        'vancat.middlewares.AuthMiddleware',
        'vancat.middlewares.LoggingMiddleware',
    ],
}

CORS_ORIGIN_WHITELIST = [
    'http://localhost:39001',
    'http://0.0.0.0:39001',
    'http://dev.bennnnsss.com:39001',
    'http://dev.bennnnsss.com:29001',
    'https://39001.dev.bennnnsss.com',
]

CONSTANCE_CONFIG = {
    'MINTER_PK': ('', ''),
}

STATICFILES_STORAGE = 'spa.storage.SPAStaticFilesStorage'
