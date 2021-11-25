from datetime import datetime
from datetime import timedelta
from django.db import connections, DataError
from django_elasticsearch_dsl_drf.constants import (
    LOOKUP_FILTER_RANGE,
    LOOKUP_QUERY_IN,
    LOOKUP_QUERY_GT,
    LOOKUP_QUERY_GTE,
    LOOKUP_QUERY_LT,
    LOOKUP_QUERY_LTE,
)
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    IdsFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    SearchFilterBackend,
)
from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.views import Response
from rest_framework.generics import ListAPIView
from .models import Bank, Etc, Pcs, Rack
from .documents import EssMonitoringLogDocument
from .paginations import LargeResultsSetPagination
from .serializer import (
    BankSerializer,
    EtcSerializer,
    PcsSerializer,
    RackSerializer,
    BankAvgSoCSerializer,
    RackAvgSoCSerializer,
    BankAvgSoHSerializer,
    RackAvgSoHSerializer,
    AvgBankPowerSerializer,
    EssMonitoringLogDocumentSerializer,
)


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


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


class BankAvgSoCListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            time_bucket_width = request.query_params.get("time-bucket-width")
            bank_id = self.kwargs["bank_id"]
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections["ess"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_SOC") avg_bank_soc 
                    FROM bank 
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "time_bucket_width": time_bucket_width,
                    "bank_id": bank_id,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = BankAvgSoCSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class RackAvgSoCListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            time_bucket_width = request.query_params.get("time-bucket-width")
            bank_id = self.kwargs["bank_id"]
            rack_id = self.kwargs["rack_id"]
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections["ess"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("RACK_SOC") avg_rack_soc 
                    FROM rack
                    WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "time_bucket_width": time_bucket_width,
                    "bank_id": bank_id,
                    "rack_id": rack_id,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = RackAvgSoCSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class BankAvgSoHListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            time_bucket_width = request.query_params.get("time-bucket-width")
            bank_id = self.kwargs["bank_id"]
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections["ess"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_SOH") avg_bank_soh 
                    FROM bank 
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time"
                """

                params = {
                    "time_bucket_width": time_bucket_width,
                    "bank_id": bank_id,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = BankAvgSoHSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class RackAvgSoHListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            time_bucket_width = request.query_params.get("time-bucket-width")
            bank_id = self.kwargs["bank_id"]
            rack_id = self.kwargs["rack_id"]
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections["ess"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("RACK_SOH") avg_rack_soh 
                    FROM rack
                    WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "time_bucket_width": time_bucket_width,
                    "bank_id": bank_id,
                    "rack_id": rack_id,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = RackAvgSoHSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class AvgBankPowerListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            operation_site_num = self.kwargs["operation_site_num"]
            bank_id = self.kwargs["bank_id"]
            date = request.query_params.get("date")
            start_date = date
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            time_bucket_width = request.query_params.get("time-bucket-width")

            with connections["ess"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_POWER") avg_bank_power 
                    FROM bank
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time"
                """

                params = {
                    "time_bucket_width": time_bucket_width,
                    "bank_id": bank_id,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgBankPowerSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class EssMonitoringLogDocumentView(BaseDocumentViewSet):
    document = EssMonitoringLogDocument
    serializer_class = EssMonitoringLogDocumentSerializer
    pagination_class = PageNumberPagination
    lookup_field = "time"
    filter_backends = [
        IdsFilterBackend,
        FilteringFilterBackend,
        OrderingFilterBackend,
        DefaultOrderingFilterBackend,
        SearchFilterBackend,
    ]
    search_fields = (
        "time",
        "operation_site",
        "log_level",
        "message",
    )
    filter_fields = {
        "time": {
            "field": "@timestamp",
            "lookups": [
                LOOKUP_FILTER_RANGE,
                LOOKUP_QUERY_IN,
                LOOKUP_QUERY_GT,
                LOOKUP_QUERY_GTE,
                LOOKUP_QUERY_LT,
                LOOKUP_QUERY_LTE,
            ],
        },
        "operation_site": "log.logger",
        "log_level": "log.level",
        "message": "message",
    }
    ordering_fields = {
        "time": "@timestamp",
    }
    ordering = ("-time",)

    def get_queryset(self):
        return super().get_queryset()
