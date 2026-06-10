from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Managing static files

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# STATIC_ROOT = BASE_DIR / "static"

MEDIA_ROOT = BASE_DIR / "media"

MEDIA_URL = "/media/"

# Storage setting

# DEFAULT_FILE_STORAGE = os.getenv("DEFAULT_FILE_STORAGE")

# STATICFILES_STORAGE = os.getenv("STATICFILES_STORAGE")

# GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME")
