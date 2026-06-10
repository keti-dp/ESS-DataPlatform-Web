from django.contrib import admin
from .models import Application, DataSet, OpenAPI, Subscription


class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "email",
        "name",
        "created_time",
        "access_token_validity_time",
    )

    @admin.display(description="email", ordering="user__email")
    def email(self, obj):
        return obj.user.email


class OpenAPIAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "context",
        "version",
        "type",
        "created_time",
        "updated_time",
    )

    prepopulated_fields = {"slug": ("name",)}


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "application_name",
        "openapi_name",
        "user",
    )

    @admin.display(description="application_name")
    def application_name(self, obj):
        return obj.application.name

    @admin.display(description="openapi_name")
    def openapi_name(self, obj):
        return obj.openapi.name


class DataSetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "file",
        "openapi",
    )


admin.site.register(Application, ApplicationAdmin)
admin.site.register(OpenAPI, OpenAPIAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(DataSet, DataSetAdmin)
