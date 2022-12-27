from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from .models import (
    AvgBankSoH,
    AvgRackSoH,
    ForecastingBankSoL,
    ForecastingMaxRackCellVoltage,
    ForecastingMinRackCellVoltage,
    ForecastingMaxRackCellTemperature,
    ForecastingMinRackCellTemperature,
    SoS,
    ExSoS,
)
from .filters import CustomDateFilterBackend, CustomDateTimeFilterBackend
from .serializer import (
    AvgBankSoHSerializer,
    AvgRackSoHSerializer,
    ForecastingBankSoLSerializer,
    ForecastingMaxRackCellVoltageSerializer,
    ForecastingMinRackCellVoltageSerializer,
    ForecastingMaxRackCellTemperatureSerializer,
    ForecastingMinRackCellTemperatureSerializer,
    SoSSerializer,
    ExSoSSerializer,
)


class AvgBankSoHListViewSet(ReadOnlyModelViewSet):
    serializer_class = AvgBankSoHSerializer
    filter_backends = [CustomDateFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]

        return AvgBankSoH.objects.filter(operating_site=operating_site_id).order_by("bank_id", "date")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        bank_id = self.kwargs["pk"]
        queryset = self.get_queryset().filter(bank_id=bank_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = AvgBankSoHSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class AvgRackSoHListViewSet(ReadOnlyModelViewSet):
    serializer_class = AvgRackSoHSerializer
    filter_backends = [CustomDateFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_pk"]

        return AvgRackSoH.objects.filter(operating_site=operating_site_id, bank_id=bank_id).order_by(
            "bank_id", "rack_id", "date"
        )

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = AvgRackSoHSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class ForecastingBankSoLListViewSet(ReadOnlyModelViewSet):
    serializer_class = ForecastingBankSoLSerializer
    filter_backends = [CustomDateFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]

        return ForecastingBankSoL.objects.filter(operating_site=operating_site_id).order_by("bank_id", "date")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs):
        bank_id = self.kwargs["pk"]
        queryset = self.get_queryset().filter(bank_id=bank_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ForecastingBankSoLSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class ForecastingMaxRackCellVoltageViewSet(ReadOnlyModelViewSet):
    serializer_class = ForecastingMaxRackCellVoltageSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_id"]

        return ForecastingMaxRackCellVoltage.objects.filter(
            operating_site=operating_site_id, bank_id=bank_id
        ).order_by("rack_id", "time")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ForecastingMaxRackCellVoltageSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class ForecastingMinRackCellVoltageViewSet(ReadOnlyModelViewSet):
    serializer_class = ForecastingMinRackCellVoltageSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_id"]

        return ForecastingMinRackCellVoltage.objects.filter(
            operating_site=operating_site_id, bank_id=bank_id
        ).order_by("rack_id", "time")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ForecastingMinRackCellVoltageSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class ForecastingMaxRackCellTemperatureViewSet(ReadOnlyModelViewSet):
    serializer_class = ForecastingMaxRackCellTemperatureSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_id"]

        return ForecastingMaxRackCellTemperature.objects.filter(
            operating_site=operating_site_id, bank_id=bank_id
        ).order_by("rack_id", "time")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ForecastingMaxRackCellTemperatureSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class ForecastingMinRackCellTemperatureViewSet(ReadOnlyModelViewSet):
    serializer_class = ForecastingMinRackCellTemperatureSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_id"]

        return ForecastingMinRackCellTemperature.objects.filter(
            operating_site=operating_site_id, bank_id=bank_id
        ).order_by("rack_id", "time")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ForecastingMinRackCellTemperatureSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class SoSViewSet(ReadOnlyModelViewSet):
    serializer_class = SoSSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_id"]

        return SoS.objects.filter(operating_site=operating_site_id, bank_id=bank_id).order_by("rack_id", "time")

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = SoSSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class BankExSoSViewSet(ReadOnlyModelViewSet):
    serializer_class = ExSoSSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]

        queryset = ExSoS.objects.filter(operating_site=operating_site_id).order_by("bank_id", "time")

        return queryset

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        bank_id = kwargs["pk"]
        queryset = self.get_queryset().filter(bank_id=bank_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ExSoSSerializer(filter_queryset, many=True)

        return Response(serializer.data)


class RackExSoSViewSet(ReadOnlyModelViewSet):
    serializer_class = ExSoSSerializer
    filter_backends = [CustomDateTimeFilterBackend]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        bank_id = self.kwargs["bank_pk"]

        queryset = ExSoS.objects.filter(operating_site=operating_site_id, bank_id=bank_id).order_by(
            "bank_id", "rack_id", "time"
        )
        return queryset

    def paginate_queryset(self, queryset):
        return None

    def retrieve(self, request, *args, **kwargs) -> list:
        rack_id = kwargs["pk"]
        queryset = self.get_queryset().filter(rack_id=rack_id)
        filter_queryset = self.filter_queryset(queryset)
        serializer = ExSoSSerializer(filter_queryset, many=True)

        return Response(serializer.data)
