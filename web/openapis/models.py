from django.conf import settings
from django.db import models


def dataset_directory_path(instance, filename):
    return f"api/{instance.openapi.name}/{filename}"


class Application(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True)
    throttling_policy = models.CharField(max_length=50)
    access_token = models.TextField()
    access_token_validity_time = models.DateTimeField()
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user}_{self.name}"


class OpenAPI(models.Model):
    id = models.CharField(max_length=256, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    context = models.CharField(max_length=256)
    version = models.CharField(max_length=30)
    type = models.CharField(max_length=10)
    api_definition = models.JSONField()
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=150, unique=True, allow_unicode=True, default="")

    def __str__(self):
        return self.name


class Subscription(models.Model):
    id = models.CharField(max_length=256, primary_key=True)
    throttling_policy = models.CharField(max_length=50)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    openapi = models.ForeignKey(OpenAPI, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class DataSet(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    openapi = models.ForeignKey(OpenAPI, on_delete=models.CASCADE)
    file = models.FileField(upload_to=dataset_directory_path)

    def __str__(self):
        return self.name
