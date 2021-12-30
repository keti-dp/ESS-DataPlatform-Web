# SECURITY WARNING: don't run with debug turned on in production!
from .base import *

DEBUG = True

ALLOWED_HOSTS = []

"""
Static Files Management

For collect static files using STATIC_ROOT, uncomment STATICFILES_DIRS
Or set other path value in STATIC_ROOT
"""

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# STATIC_ROOT = BASE_DIR / "static"

"""
Storage Setting

If you want to configure local static file and collect static files in local, keep the comments below
Else you want to configure storage static file and collect static files in storage, uncomment below
"""

DEFAULT_FILE_STORAGE = os.getenv("DEFAULT_FILE_STORAGE")

STATICFILES_STORAGE = os.getenv("STATICFILES_STORAGE")

GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME")
