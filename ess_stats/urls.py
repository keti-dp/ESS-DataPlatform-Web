from django.urls import include, path
from rest_framework_nested import routers as nested_routers
from .views import AvgBankSoHListViewSet, AvgRackSoHListViewSet

router = nested_routers.SimpleRouter()
router.register(r"banks", AvgBankSoHListViewSet, basename="banks")

banks_router = nested_routers.NestedSimpleRouter(router, r"banks", lookup="bank")
banks_router.register(r"racks", AvgRackSoHListViewSet, basename="bank-racks")


urlpatterns = [
    path("avg-soh/operating-sites/<int:operating_site_id>/", include(router.urls)),
    path("avg-soh/operating-sites/<int:operating_site_id>/", include(banks_router.urls)),
]
