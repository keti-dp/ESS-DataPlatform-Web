from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    is_pro_request_status = models.BooleanField(default=False)
