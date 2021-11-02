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