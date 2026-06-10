from rest_framework import serializers
from .models import CustomUser


class CustomUserSeriealizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_pro_request_status"]
        read_only_fields = ["email"]
