from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_nested import routers as nested_routers
from .views import (
    AvgBankSoHListViewSet,
    AvgRackSoHListViewSet,
    ForecastingBankSoLListViewSet,
    ForecastingMaxRackCellVoltageViewSet,
    ForecastingMinRackCellVoltageViewSet,
    ForecastingMaxRackCellTemperatureViewSet,
    ForecastingMinRackCellTemperatureViewSet,
    SoSViewSet,
    EXSoSBankViewSet,
    EXSoSRackViewSet,
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

forecasting_max_rack_cell_temperature_router = SimpleRouter()
forecasting_max_rack_cell_temperature_router.register(
    r"racks", ForecastingMaxRackCellTemperatureViewSet, basename="racks"
)

forecasting_min_rack_cell_temperature_router = SimpleRouter()
forecasting_min_rack_cell_temperature_router.register(
    r"racks", ForecastingMinRackCellTemperatureViewSet, basename="racks"
)

sos_router = SimpleRouter()
sos_router.register(r"racks", SoSViewSet, basename="racks")

exsos_router = nested_routers.SimpleRouter()
exsos_router.register(r"banks", EXSoSBankViewSet, basename="banks")

exsos_bank_router = nested_routers.NestedSimpleRouter(exsos_router, r"banks", lookup="bank")
exsos_bank_router.register(r"racks", EXSoSRackViewSet, basename="racks")


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
    path(
        "forecasting-max-cell-temperature/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/",
        include(forecasting_max_rack_cell_temperature_router.urls),
    ),
    path(
        "forecasting-min-cell-temperature/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/",
        include(forecasting_min_rack_cell_temperature_router.urls),
    ),
    path(
        "sos/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/",
        include(sos_router.urls),
    ),
    path("ex-sos/operating-sites/<int:operating_site_id>/", include(exsos_router.urls)),
    path("ex-sos/operating-sites/<int:operating_site_id>/", include(exsos_bank_router.urls)),
]
