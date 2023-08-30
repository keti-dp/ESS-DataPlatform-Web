"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 3.2.8.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "debug_toolbar",
    "django_apscheduler",
    "django_filters",
    "django_elasticsearch_dsl",
    "django_elasticsearch_dsl_drf",
    "rest_framework",
    "test_without_migrations",
    "ess",
    "ess_feature",
    "ess_stats",
    "simulation",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.getenv("DEFAULT_DB_ENGINE"),
        "HOST": os.getenv("DEFAULT_DB_HOST"),
        "PORT": os.getenv("DEFAULT_DB_PORT"),
        "NAME": os.getenv("DEFAULT_DB_NAME"),
        "USER": os.getenv("DEFAULT_DB_USER"),
        "PASSWORD": os.getenv("DEFAULT_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": ["ess"],
            "NAME": os.getenv("DEFAULT_TEST_DB_NAME"),
        },
    },
    "ess1": {
        "ENGINE": os.getenv("ESS_DB_ENGINE"),
        "HOST": os.getenv("ESS_DB_HOST"),
        "PORT": os.getenv("ESS_DB_PORT"),
        "NAME": os.getenv("ESS_DB_NAME"),
        "USER": os.getenv("ESS_DB_USER"),
        "PASSWORD": os.getenv("ESS_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": [],
            "NAME": os.getenv("ESS_TEST_DB_NAME"),
        },
    },
    "ess2": {
        "ENGINE": os.getenv("ESS2_DB_ENGINE"),
        "HOST": os.getenv("ESS2_DB_HOST"),
        "PORT": os.getenv("ESS2_DB_PORT"),
        "NAME": os.getenv("ESS2_DB_NAME"),
        "USER": os.getenv("ESS2_DB_USER"),
        "PASSWORD": os.getenv("ESS2_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": [],
            "NAME": os.getenv("ESS2_TEST_DB_NAME"),
        },
    },
    "ess3": {
        "ENGINE": os.getenv("ESS3_DB_ENGINE"),
        "HOST": os.getenv("ESS3_DB_HOST"),
        "PORT": os.getenv("ESS3_DB_PORT"),
        "NAME": os.getenv("ESS3_DB_NAME"),
        "USER": os.getenv("ESS3_DB_USER"),
        "PASSWORD": os.getenv("ESS3_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": [],
            "NAME": os.getenv("ESS3_TEST_DB_NAME"),
        },
    },
    "ess4": {
        "ENGINE": os.getenv("ESS4_DB_ENGINE"),
        "HOST": os.getenv("ESS4_DB_HOST"),
        "PORT": os.getenv("ESS4_DB_PORT"),
        "NAME": os.getenv("ESS4_DB_NAME"),
        "USER": os.getenv("ESS4_DB_USER"),
        "PASSWORD": os.getenv("ESS4_DB_PASSWORD"),
    },
    "ess_feature": {
        "ENGINE": os.getenv("ESS_FEATURE_DB_ENGINE"),
        "HOST": os.getenv("ESS_FEATURE_DB_HOST"),
        "PORT": os.getenv("ESS_FEATURE_DB_PORT"),
        "NAME": os.getenv("ESS_FEATURE_DB_NAME"),
        "USER": os.getenv("ESS_FEATURE_DB_USER"),
        "PASSWORD": os.getenv("ESS_FEATURE_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": [],
            "NAME": os.getenv("ESS_FEATURE_DB_NAME"),
        },
    },
    "ess_stats": {
        "ENGINE": os.getenv("ESS_STATS_DB_ENGINE"),
        "HOST": os.getenv("ESS_STATS_DB_HOST"),
        "PORT": os.getenv("ESS_STATS_DB_PORT"),
        "NAME": os.getenv("ESS_STATS_DB_NAME"),
        "USER": os.getenv("ESS_STATS_DB_USER"),
        "PASSWORD": os.getenv("ESS_STATS_DB_PASSWORD"),
        "TEST": {
            "DEPENDENCIES": [],
            "NAME": os.getenv("ESS_STATS_DB_NAME"),
        },
    },
}

DATABASE_ROUTERS = [
    "ess.routers.ESSRouter",
    "ess_feature.routers.ESSFeatureRouter",
    "ess_stats.routers.ESSStatsRouter",
]

ELASTICSEARCH_DSL = {"default": {"hosts": os.getenv("ESS_ELASTICSEARCH_HOST")}}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": ("config.authenticate.CustomJWTTokenUserAuthentication",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
}

REST_SESSION_LOGIN = False

SIMPLE_JWT = {
    "SIGNING_KEY": os.getenv("JWT_SECRET_KEY"),
    "VERIFYING_KEY": os.getenv("JWT_SECRET_KEY"),
}

# Django debug toolbar settings
INTERNAL_IPS = [
    "127.0.0.1",
]

# Django APScheduler settings

APSCHEDULER_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

APSCHEDULER_RUN_NOW_TIMEOUT = 25

SCHEDULER_DEFAULT = True
