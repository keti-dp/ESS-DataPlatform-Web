# SECURITY WARNING: don't run with debug turned on in production!
from .base import *

DEBUG = True

ALLOWED_HOSTS = []

STATICFILES_DIRS = [
    BASE_DIR / "static",
]
