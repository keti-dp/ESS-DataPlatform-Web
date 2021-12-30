from .base import *

DEBUG = False

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS").split(",")

# Storage Setting

DEFAULT_FILE_STORAGE = os.getenv("DEFAULT_FILE_STORAGE")

STATICFILES_STORAGE = os.getenv("STATICFILES_STORAGE")

GS_BUCKET_NAME = os.getenv("GS_BUCKET_NAME")
