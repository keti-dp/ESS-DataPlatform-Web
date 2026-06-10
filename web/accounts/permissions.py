from rest_framework import permissions
from .models import CustomUser


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, CustomUser):
            return request.user == obj

        return request.user == obj.user


class IsPro(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="pro").exists()
