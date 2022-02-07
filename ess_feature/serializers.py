from rest_framework import serializers
from rest_flex_fields.serializers import FlexFieldsModelSerializer
from .models import ProtectionMapFeature


class ProtectionMapFeatureSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ProtectionMapFeature
        fields = "__all__"
        depth = 1
