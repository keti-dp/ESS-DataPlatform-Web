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
