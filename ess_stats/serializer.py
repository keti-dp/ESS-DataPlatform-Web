from rest_framework import serializers
from .models import (
    AvgBankSoH,
    AvgRackSoH,
    ForecastingBankSoL,
    ForecastingMaxRackCellVoltage,
    ForecastingMinRackCellVoltage,
    ForecastingMaxRackCellTemperature,
    ForecastingMinRackCellTemperature,
    SoS,
    EXSoS,
)


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


class ForecastingMinRackCellVoltageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingMinRackCellVoltage
        fields = "__all__"


class ForecastingMaxRackCellTemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingMaxRackCellTemperature
        fields = "__all__"


class ForecastingMinRackCellTemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastingMinRackCellTemperature
        fields = "__all__"


class SoSSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoS
        fields = "__all__"


class EXSoSSerializer(serializers.ModelSerializer):
    membership_degree = serializers.JSONField()

    class Meta:
        model = EXSoS
        fields = "__all__"
