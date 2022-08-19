from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_nested import routers as nested_routers
from .views import (
    AvgBankSoHListViewSet,
    AvgRackSoHListViewSet,
    ForecastingBankSoLListViewSet,
    ForecastingMaxRackCellVoltageViewSet,
    ForecastingMinRackCellVoltageViewSet,
)

router = SimpleRouter()
router.register(r"banks", ForecastingBankSoLListViewSet, basename="banks")

nested_router = nested_routers.SimpleRouter()
nested_router.register(r"banks", AvgBankSoHListViewSet, basename="banks")

avg_bank_soh_router = nested_routers.NestedSimpleRouter(nested_router, r"banks", lookup="bank")
avg_bank_soh_router.register(r"racks", AvgRackSoHListViewSet, basename="bank-racks")

forecasting_max_rack_cell_voltage_router = SimpleRouter()
forecasting_max_rack_cell_voltage_router.register(r"racks", ForecastingMaxRackCellVoltageViewSet, basename="racks")

forecasting_min_rack_cell_voltage_router = SimpleRouter()
forecasting_min_rack_cell_voltage_router.register(r"racks", ForecastingMinRackCellVoltageViewSet, basename="racks")


urlpatterns = [
    path("avg-soh/operating-sites/<int:operating_site_id>/", include(nested_router.urls)),
    path("avg-soh/operating-sites/<int:operating_site_id>/", include(avg_bank_soh_router.urls)),
    path("forecasting-sol/operating-sites/<int:operating_site_id>/", include(router.urls)),
    path(
        "forecasting-max-cell-voltage/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/",
        include(forecasting_max_rack_cell_voltage_router.urls),
    ),
    path(
        "forecasting-min-cell-voltage/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/",
        include(forecasting_min_rack_cell_voltage_router.urls),
    ),
]
