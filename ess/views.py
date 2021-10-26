from datetime import datetime
from datetime import timedelta
from rest_framework.generics import ListAPIView
from .models import Bank, Etc, Pcs, Rack
from .paginations import LargeResultsSetPagination
from .serializer import BankSerializer, EtcSerializer, PcsSerializer, RackSerializer


class BankListView(ListAPIView):
    serializer_class = BankSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        operation_num = self.kwargs["operation_num"]
        bank_id = self.kwargs["bank_id"]
        date = self.request.query_params.get("date")

        queryset = Bank.objects.filter(bank_id=bank_id).order_by("timestamp")

        if date is not None:
            new_date = datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
            queryset = queryset.filter(bank_id=bank_id, timestamp__gte=date, timestamp__lt=new_date)

        return queryset


class EtcListView(ListAPIView):
    serializer_class = EtcSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        operation_num = self.kwargs["operation_num"]
        bank_id = self.kwargs["bank_id"]
        date = self.request.query_params.get("date")

        queryset = Etc.objects.filter(bank_id=bank_id).order_by("timestamp")

        if date is not None:
            new_date = datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
            queryset = queryset.filter(bank_id=bank_id, timestamp__gte=date, timestamp__lt=new_date)

        return queryset


class PcsListView(ListAPIView):
    serializer_class = PcsSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        operation_num = self.kwargs["operation_num"]
        bank_id = self.kwargs["bank_id"]
        date = self.request.query_params.get("date")

        queryset = Pcs.objects.filter(bank_id=bank_id).order_by("timestamp")

        if date is not None:
            new_date = datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
            queryset = queryset.filter(bank_id=bank_id, timestamp__gte=date, timestamp__lt=new_date)

        return queryset


class RackListView(ListAPIView):
    serializer_class = RackSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        operation_num = self.kwargs["operation_num"]
        bank_id = self.kwargs["bank_id"]
        date = self.request.query_params.get("date")

        queryset = Rack.objects.filter(bank_id=bank_id).order_by("timestamp")

        if date is not None:
            new_date = datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
            queryset = queryset.filter(bank_id=bank_id, timestamp__gte=date, timestamp__lt=new_date)

        return queryset
