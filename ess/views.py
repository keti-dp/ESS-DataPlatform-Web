import csv
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
from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.views import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .documents import EssMonitoringLogDocument
from .paginations import LargeResultsSetPagination
from .serializer import (
    AvgESSBankSoCSerializer,
    AvgESSRackSoCSerializer,
    AvgESSBankSoHSerializer,
    AvgESSRackSoHSerializer,
    AvgESSBankPowerSerializer,
    EssMonitoringLogDocumentSerializer,
)

# This custom module have dynamic ess models, serializers, data_dates
from .ess_collections import (
    ESS_BANK,
    ESS_RACK,
    ESS_PCS,
    ESS_ETC,
    ESS_BANK_SERIALIZER,
    ESS_RACK_SERIALIZER,
    ESS_PCS_SERIALIZER,
    ESS_ETC_SERIALIZER,
)


class Echo:
    """An object that implements just the write method of the file-like interface."""

    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def get_csv_items(rows, pseudo_buffer, fieldnames):
    writer = csv.DictWriter(pseudo_buffer, fieldnames=fieldnames)
    yield writer.writeheader()

    for row in rows:
        yield writer.writerow(row)


# General ESS model list view


class ESSBankListView(ListAPIView):
    pagination_class = LargeResultsSetPagination

    def get_serializer_class(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)

        return ESS_BANK_SERIALIZER[database]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        bank_id = self.kwargs["bank_id"]
        start_date = self.request.query_params.get("date")

        if start_date is not None:
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            queryset = (
                ESS_BANK[database]
                .objects.using(database)
                .filter(bank_id=bank_id, timestamp__gte=start_date, timestamp__lt=end_date)
            ).order_by("timestamp")
        else:
            queryset = ESS_BANK[database].objects.using(database).filter(bank_id=bank_id).order_by("timestamp")

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(operating_site_id)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ESSRackListView(ListAPIView):
    pagination_class = LargeResultsSetPagination

    def get_serializer_class(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)

        return ESS_RACK_SERIALIZER[database]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        bank_id = self.kwargs["bank_id"]
        start_date = self.request.query_params.get("date")

        if start_date is not None:
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            queryset = (
                ESS_RACK[database]
                .objects.using(database)
                .filter(bank_id=bank_id, timestamp__gte=start_date, timestamp__lt=end_date)
                .order_by("timestamp")
            )
        else:
            queryset = ESS_RACK[database].objects.using(database).filter(bank_id=bank_id).order_by("timestamp")

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(operating_site_id)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ESSPcsListView(ListAPIView):
    pagination_class = LargeResultsSetPagination

    def get_serializer_class(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)

        return ESS_PCS_SERIALIZER[database]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        start_date = self.request.query_params.get("date")

        if start_date is not None:
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            queryset = (
                ESS_PCS[database]
                .objects.using(database)
                .filter(timestamp__gte=start_date, timestamp__lt=end_date)
                .order_by("timestamp")
            )
        else:
            queryset = ESS_PCS[database].objects.using(database).all().order_by("timestamp")

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(operating_site_id)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ESSEtcListView(ListAPIView):
    pagination_class = LargeResultsSetPagination

    def get_serializer_class(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)

        return ESS_ETC_SERIALIZER[database]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        start_date = self.request.query_params.get("date")

        if start_date is not None:
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            queryset = (
                ESS_ETC[database]
                .objects.using(database)
                .filter(timestamp__gte=start_date, timestamp__lt=end_date)
                .order_by("timestamp")
            )
        else:
            queryset = ESS_ETC[database].objects.using(database).all().order_by("timestamp")

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(operating_site_id)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# General ESS model detail list view


class ESSRackDetailListView(ListAPIView):
    pagination_class = LargeResultsSetPagination

    def get_serializer_class(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)

        return ESS_RACK_SERIALIZER[database]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        bank_id = self.kwargs["bank_id"]
        rack_id = self.kwargs["rack_id"]
        start_date = self.request.query_params.get("date")

        if start_date is not None:
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            queryset = (
                ESS_RACK[database]
                .objects.using(database)
                .filter(bank_id=bank_id, rack_id=rack_id, timestamp__gte=start_date, timestamp__lt=end_date)
                .order_by("timestamp")
            )
        else:
            queryset = (
                ESS_RACK[database]
                .objects.using(database)
                .filter(bank_id=bank_id, rack_id=rack_id)
                .order_by("timestamp")
            )

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data)
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(operating_site_id)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"code": "400", "exception type": "Value Error", "message": "올바른 요청 파라미터를 입력하세요.(date)"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Data analytics results list view


class AvgESSBankSoCListView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            bank_id = kwargs["bank_id"]
            time_bucket_width = request.query_params.get("time-bucket-width")
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections[database].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_SOC") avg_bank_soc 
                    FROM bank 
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "bank_id": bank_id,
                    "time_bucket_width": time_bucket_width,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgESSBankSoCSerializer(data=data, many=True)

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


class AvgESSRackSoCListView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            bank_id = kwargs["bank_id"]
            rack_id = kwargs["rack_id"]
            time_bucket_width = request.query_params.get("time-bucket-width")
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections[database].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("RACK_SOC") avg_rack_soc 
                    FROM rack
                    WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "bank_id": bank_id,
                    "rack_id": rack_id,
                    "time_bucket_width": time_bucket_width,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgESSRackSoCSerializer(data=data, many=True)

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


class AvgESSBankSoHListView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            bank_id = kwargs["bank_id"]
            time_bucket_width = request.query_params.get("time-bucket-width")
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections[database].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_SOH") avg_bank_soh 
                    FROM bank 
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time"
                """

                params = {
                    "bank_id": bank_id,
                    "time_bucket_width": time_bucket_width,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgESSBankSoHSerializer(data=data, many=True)

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


class AvgESSRackSoHListView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            bank_id = kwargs["bank_id"]
            rack_id = kwargs["rack_id"]
            time_bucket_width = request.query_params.get("time-bucket-width")
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections[database].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("RACK_SOH") avg_rack_soh 
                    FROM rack
                    WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time" 
                """

                params = {
                    "bank_id": bank_id,
                    "rack_id": rack_id,
                    "time_bucket_width": time_bucket_width,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgESSRackSoHSerializer(data=data, many=True)

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


class AvgESSBankPowerListView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            bank_id = kwargs["bank_id"]
            time_bucket_width = request.query_params.get("time-bucket-width")
            start_date = request.query_params.get("date")
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            with connections[database].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP") "time", AVG("BANK_POWER") avg_bank_power 
                    FROM bank
                    WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                    GROUP BY "time" ORDER BY "time"
                """

                params = {
                    "bank_id": bank_id,
                    "time_bucket_width": time_bucket_width,
                    "start_date": start_date,
                    "end_date": end_date,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = AvgESSBankPowerSerializer(data=data, many=True)

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


# ESS monitoring log list view


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


# Latest ESS model retrieve view


class LatestESSBankView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        operating_site_id = kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        bank_id = kwargs["bank_id"]
        queryset = ESS_BANK[database].objects.using(database).filter(bank_id=bank_id).latest("timestamp")
        serializer = ESS_BANK_SERIALIZER[database](queryset)

        return Response(serializer.data)


class LatestESSRackView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        operating_site_id = kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        bank_id = kwargs["bank_id"]
        rack_id = kwargs["rack_id"]
        queryset = (
            ESS_RACK[database].objects.using(database).filter(bank_id=bank_id, rack_id=rack_id).latest("timestamp")
        )
        serializer = ESS_RACK_SERIALIZER[database](queryset)

        return Response(serializer.data)


class LatestESSPcsView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        operating_site_id = kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        queryset = ESS_PCS[database].objects.using(database).all().latest("timestamp")
        serializer = ESS_PCS_SERIALIZER[database](queryset)

        return Response(serializer.data)


class LatestESSEtcView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        operating_site_id = kwargs["operating_site_id"]
        database = "ess" + str(operating_site_id)
        queryset = ESS_ETC[database].objects.using(database).all().latest("timestamp")
        serializer = ESS_ETC_SERIALIZER[database](queryset)

        return Response(serializer.data)


# ESS operating data(ESS model) download view


class ESSOperatingDataDownloadView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            database = "ess" + str(operating_site_id)
            start_time_query_param = request.query_params.get("start-time")
            start_time = datetime.strptime(start_time_query_param, "%Y-%m-%dT%H:%M:%S")
            end_time_query_param = request.query_params.get("end-time")
            end_time = datetime.strptime(end_time_query_param, "%Y-%m-%dT%H:%M:%S")
            data_types = {
                "bank": ESS_BANK[database],
                "rack": ESS_RACK[database],
                "pcs": ESS_PCS[database],
                "etc": ESS_ETC[database],
            }
            data_type = kwargs["data_type"]
            queryset = (
                data_types[data_type]
                .objects.using(database)
                .filter(timestamp__gte=start_time, timestamp__lte=end_time)
                .order_by("timestamp")
            )
            fieldnames = list(queryset.values()[0].keys())

            return StreamingHttpResponse(
                (get_csv_items(queryset.values(), Echo(), fieldnames)),
                content_type="text/csv",
                headers={"Content-Disposition": 'attachment; filename="' + data_type + '.csv"'},
            )
        except KeyError:
            return Response(
                {"code": "400", "exception type": "Key Error", "message": "올바른 요청 URL을 입력하세요.(data_type)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {
                    "code": "400",
                    "exception type": "Value Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time 형식은 'YYYY-MM-DDThh:mm:ss' 입니다.)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except TypeError:
            return Response(
                {"code": "400", "exception type": "Type Error", "message": "필수 요청 파라미터를 입력하세요.(start-time, end-time)"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except IndexError:
            return Response(
                {"code": "404", "exception type": "Index Error", "message": "해당 데이터를 찾을 수 없습니다."},
                status=status.HTTP_404_NOT_FOUND,
            )
