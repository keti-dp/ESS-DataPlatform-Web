from django.core.exceptions import ValidationError
from django.db import connections, DataError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.views import Response, status
from .models import ProtectionMapFeature
from .serializers import ProtectionMapFeatureSerializer, ProtectionMapFeatureLogLevelCountSerializer

TIME_BUCKET_TIMEZONE = "Asia/Seoul"


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


class ProtectionMapFeatureView(ListAPIView):
    serializer_class = ProtectionMapFeatureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["error_code", "level"]

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        time_query_param = self.request.query_params.get("time")
        start_time_query_param = self.request.query_params.get("start-time")
        end_time_query_param = self.request.query_params.get("end-time")

        if time_query_param is not None:
            queryset = ProtectionMapFeature.objects.filter(
                operating_site=operating_site_id, timestamp=time_query_param
            ).order_by("-timestamp")

            return queryset

        queryset = ProtectionMapFeature.objects.filter(
            operating_site=operating_site_id, timestamp__gte=start_time_query_param, timestamp__lt=end_time_query_param
        ).order_by("-timestamp")

        return queryset


class ProtectionMapFeatureAllListView(ListAPIView):
    serializer_class = ProtectionMapFeatureSerializer

    def get_queryset(self):
        time = self.request.query_params.get("time")
        start_time = self.request.query_params.get("start-time")
        end_time = self.request.query_params.get("end-time")

        # If 'time' parameter is included, other parameters are ignored.
        if time:
            queryset = ProtectionMapFeature.objects.filter(timestamp=time).order_by("-timestamp")
        else:
            queryset = ProtectionMapFeature.objects.filter(timestamp__gte=start_time, timestamp__lt=end_time).order_by(
                "-timestamp"
            )

        return queryset

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except ValidationError:
            return Response(
                {
                    "code": "400",
                    "exception": "Validation Error",
                    "message": "올바른 요청 파라미터를 입력하세요.('time' 형식은 'YYYY-MM-DDThh:mm:ss' 입니다.)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {
                    "code": "400",
                    "exception": "Value Error",
                    "message": "필수 요청 파라미터를 입력하세요.('time' 또는 'start-time' & 'end-time')",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProtectionMapFeatureLogLevelCountView(ListAPIView):
    def get_queryset(self):
        return None

    def get(self, request, *args, **kwargs):
        try:
            operating_site_id = kwargs["operating_site_id"]
            start_time = request.query_params.get("start-time")
            end_time = request.query_params.get("end-time")
            time_bucket_width = request.query_params.get("time-bucket-width")

            with connections["ess_feature"].cursor() as cursor:
                query = """
                    SELECT time_bucket(%(time_bucket_width)s, "TIMESTAMP" AT TIME ZONE %(time_bucket_timezone)s) "time", "OPERATING_SITE" "operating_site", "LEVEL" "level", count("LEVEL") "level_count" 
                    FROM protectionmap_feature 
                    WHERE "OPERATING_SITE" = %(operating_site_id)s AND "TIMESTAMP" BETWEEN %(start_time)s AND %(end_time)s 
                    GROUP BY "time", "operating_site", "level" 
                    ORDER BY "time" DESC, "level"
                """

                params = {
                    "time_bucket_timezone": TIME_BUCKET_TIMEZONE,
                    "time_bucket_width": time_bucket_width,
                    "operating_site_id": operating_site_id,
                    "start_time": start_time,
                    "end_time": end_time,
                }

                cursor.execute(query, params)

                data = dictfetchall(cursor)

            serializer = ProtectionMapFeatureLogLevelCountSerializer(data=data, many=True)

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DataError:
            return Response(
                {
                    "code": "400",
                    "exception": "Data Error",
                    "message": "올바른 요청 파라미터를 입력하세요.(time-bucket-width, start-time, end-time)",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
