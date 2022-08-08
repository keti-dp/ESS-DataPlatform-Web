from rest_framework import serializers
from .models import AvgBankSoH, AvgRackSoH


class AvgBankSoHSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvgBankSoH
        fields = "__all__"


class AvgRackSoHSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvgRackSoH
        fields = "__all__"
