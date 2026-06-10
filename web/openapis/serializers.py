from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
from .models import Application, OpenAPI, Subscription


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class OpenAPISerializer(FlexFieldsModelSerializer):
    class Meta:
        model = OpenAPI
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"
        depth = 1
