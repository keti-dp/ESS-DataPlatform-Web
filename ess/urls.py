from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    BankListView,
    EtcListView,
    PcsListView,
    RackListView,
    RackDetailListView,
    BankAvgSoCListView,
    RackAvgSoCListView,
    BankAvgSoHListView,
    RackAvgSoHListView,
    AvgBankPowerListView,
    EssMonitoringLogDocumentView,
    LatestBankView,
    LatestRackView,
    LatestPcsView,
    LatestEtcView,
)

router = DefaultRouter()
router.register(r"data-monitoring-logs", EssMonitoringLogDocumentView, basename="ess-monitoring-log-document")

urlpatterns = [
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/", BankListView.as_view(), name="bank-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/etc/", EtcListView.as_view(), name="etc-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/pcs/", PcsListView.as_view(), name="pcs-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/racks/", RackListView.as_view(), name="rack-list"),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/racks/<rack_id>/",
        RackDetailListView.as_view(),
        name="rack-detail-list",
    ),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/stats/bank-avg-soc/",
        BankAvgSoCListView.as_view(),
        name="bank-avg-soc-list",
    ),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/racks/<int:rack_id>/stats/rack-avg-soc/",
        RackAvgSoCListView.as_view(),
        name="rack-avg-soc-list",
    ),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/stats/bank-avg-soh/",
        BankAvgSoHListView.as_view(),
        name="bank-avg-soh-list",
    ),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/racks/<int:rack_id>/stats/rack-avg-soh/",
        RackAvgSoHListView.as_view(),
        name="rack-avg-soh-list",
    ),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/stats/avg-bank-power/",
        AvgBankPowerListView.as_view(),
        name="avg-bank-power-list",
    ),
    path("search/", include(router.urls)),
    # Get latest operation data
    path("operation-sites/<int:operation_site_num>/banks/<int:bank_id>/latest/", LatestBankView.as_view()),
    path(
        "operation-sites/<int:operation_site_num>/banks/<int:bank_id>/racks/<int:rack_id>/latest/",
        LatestRackView.as_view(),
    ),
    path("operation-sites/<int:operation_site_num>/banks/<int:bank_id>/pcs/latest/", LatestPcsView.as_view()),
    path("operation-sites/<int:operation_site_num>/banks/<int:bank_id>/etc/latest/", LatestEtcView.as_view()),
]
