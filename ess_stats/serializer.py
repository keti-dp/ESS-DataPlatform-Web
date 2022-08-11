from rest_framework import serializers
from .models import AvgBankSoH, AvgRackSoH, ForecastingBankSoL, ForecastingMaxRackCellVoltage


class AvgBankSoHSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvgBankSoH
        fields = "__all__"


class AvgRackSoHSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvgRackSoH
        fields = "__all__"


class ForecastingBankSoLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingBankSoL
        fields = "__all__"


class ForecastingMaxRackCellVoltageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingMaxRackCellVoltage
        fields = "__all__"
