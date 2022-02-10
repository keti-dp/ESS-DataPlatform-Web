from rest_framework import serializers
from rest_flex_fields.serializers import FlexFieldsModelSerializer
from .models import ProtectionMapFeature, ProtectionMapLevel


class ProtectionMapFeatureSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ProtectionMapFeature
        fields = "__all__"
        depth = 1


class ProtectionMapFeatureLogLevelCountSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    operating_site = serializers.IntegerField()
    level = serializers.IntegerField()
    level_count = serializers.IntegerField()
