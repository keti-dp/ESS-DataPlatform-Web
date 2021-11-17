from rest_framework import serializers
from .models import Bank, Etc, Pcs, Rack


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = "__all__"


class EtcSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etc
        fields = "__all__"


class PcsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pcs
        fields = "__all__"


class RackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rack
        fields = "__all__"


class BankAvgSoCSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_soc = serializers.FloatField()


class RackAvgSoCSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_rack_soc = serializers.FloatField()


class BankAvgSoHSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_soh = serializers.FloatField()


class RackAvgSoHSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_rack_soh = serializers.FloatField()


class AvgBankPowerSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_power = serializers.FloatField()


class EssMonitoringLogDocumentSerializer(serializers.Serializer):
    time = serializers.DateTimeField(source="@timestamp", read_only=True)
    operation_site = serializers.CharField(source="log.logger", read_only=True)
    log_level = serializers.CharField(source="log.level", read_only=True)
    message = serializers.CharField(read_only=True)

    class Meta:
        fields = (
            "time",
            "operation_site",
            "log_level",
            "message",
        )
