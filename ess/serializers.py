from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from .models import Bank, Rack, Pcs, Etc, ESS2Bank, ESS2Rack, ESS2Pcs, ESS2Etc, ESS3Bank, ESS3Rack, ESS3Pcs, ESS3Etc


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


class ESS2BankSerializer(FlexFieldsModelSerializer):
    # If model type is JSONField, not working - TypeError
    # so model type is TextField -> serializer JSONField working!!
    master_rack_communication_fault = serializers.JSONField()

    class Meta:
        model = ESS2Bank
        fields = "__all__"


class ESS2RackSerializer(FlexFieldsModelSerializer):
    rack_module_fault = serializers.JSONField()

    class Meta:
        model = ESS2Rack
        fields = "__all__"


class ESS2PcsSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ESS2Pcs
        fields = "__all__"


class ESS2EtcSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ESS2Etc
        fields = "__all__"


class ESS3BankSerializer(FlexFieldsModelSerializer):
    master_rack_communication_fault = serializers.JSONField()

    class Meta:
        model = ESS3Bank
        fields = "__all__"


class ESS3RackSerializer(FlexFieldsModelSerializer):
    rack_module_fault = serializers.JSONField()

    class Meta:
        model = ESS3Rack
        fields = "__all__"


class ESS3PcsSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ESS3Pcs
        fields = "__all__"


class ESS3EtcSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ESS3Etc
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
