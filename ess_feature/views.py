from rest_framework.generics import ListAPIView
from rest_framework.views import Response
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
