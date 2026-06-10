from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + ("is_pro_request_status",)
    fieldsets = UserAdmin.fieldsets + (
        (
            "Status",
            {
                "fields": ("is_pro_request_status",),
            },
        ),
    )
    list_filter = UserAdmin.list_filter + ("is_pro_request_status",)


admin.site.register(CustomUser, CustomUserAdmin)
