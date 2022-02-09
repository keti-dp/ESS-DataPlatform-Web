from django.core.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.views import Response, status
from .models import ProtectionMapFeature
from .serializers import ProtectionMapFeatureSerializer


class ProtectionMapFeatureView(ListAPIView):
    serializer_class = ProtectionMapFeatureSerializer

    def get_queryset(self):
        operating_site_id = self.kwargs["operating_site_id"]
        start_time_query_param = self.request.query_params.get("start-time")
        end_time_query_param = self.request.query_params.get("end-time")

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
