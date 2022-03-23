from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from .models import Bank, Rack, Pcs, Etc, SecondESSBank, SecondESSRack, SecondESSPcs, SecondESSEtc


class BankSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Bank
        fields = "__all__"


class RackSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Rack
        fields = "__all__"


class PcsSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Pcs
        fields = "__all__"


class EtcSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Etc
        fields = "__all__"


class SecondESSBankSerializer(FlexFieldsModelSerializer):
    # If model type is JSONField, not working - TypeError
    # so model type is TextField -> serializer JSONField working!!
    master_rack_communication_fault = serializers.JSONField()

    class Meta:
        model = SecondESSBank
        fields = "__all__"


class SecondESSRackSerializer(FlexFieldsModelSerializer):
    rack_module_fault = serializers.JSONField()

    class Meta:
        model = SecondESSRack
        fields = "__all__"


class SecondESSPcsSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = SecondESSPcs
        fields = "__all__"


class SecondESSEtcSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = SecondESSEtc
        fields = "__all__"


class AvgESSBankSoCSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_soc = serializers.FloatField()


class AvgESSRackSoCSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_rack_soc = serializers.FloatField()


class AvgESSBankSoHSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_soh = serializers.FloatField()


class AvgESSRackSoHSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_rack_soh = serializers.FloatField()


class AvgESSBankPowerSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    avg_bank_power = serializers.FloatField()


class EssMonitoringLogDocumentSerializer(serializers.Serializer):
    time = serializers.DateTimeField(source="@timestamp", read_only=True)
    operation_site = serializers.CharField(source="log.logger", read_only=True)
    log_level = serializers.CharField(read_only=True)
    message = serializers.CharField(read_only=True)

    class Meta:
        fields = (
            "time",
            "operation_site",
            "log_level",
            "message",
        )
