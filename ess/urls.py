from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ESSBankListView,
    ESSRackListView,
    ESSPcsListView,
    ESSEtcListView,
    ESSRackDetailListView,
    AvgESSBankSoCListView,
    AvgESSRackSoCListView,
    AvgESSBankSoHListView,
    AvgESSRackSoHListView,
    AvgESSBankPowerListView,
    EssMonitoringLogDocumentView,
    LatestESSBankView,
    LatestESSRackView,
    LatestESSPcsView,
    LatestESSEtcView,
    ESSOperatingDataDownloadView,
    DeIdentificationESSBankListView,
    DeIdentificationESSRackListView,
    DeIdentificationESSPcsListView,
    DeIdentificationESSEtcListView,
    DeIdentificationESSRackDetailListView,
    DeIndentificationESSOperatingDataDownloadView,
)

router = DefaultRouter()
router.register(r"data-monitoring-logs", EssMonitoringLogDocumentView, basename="ess-monitoring-log-document")

urlpatterns = [
    # General ESS model list url
    path("operating-sites/<int:operating_site_id>/banks/<int:bank_id>/", ESSBankListView.as_view(), name="bank-list"),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/",
        ESSRackListView.as_view(),
        name="rack-list",
    ),
    path("operating-sites/<int:operating_site_id>/pcs/", ESSPcsListView.as_view(), name="pcs-list"),
    path("operating-sites/<int:operating_site_id>/etc/", ESSEtcListView.as_view(), name="etc-list"),
    # General ESS model detail list url
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/<rack_id>/",
        ESSRackDetailListView.as_view(),
        name="rack-detail-list",
    ),
    # Data analytics results list url
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/stats/avg-bank-soc/",
        AvgESSBankSoCListView.as_view(),
        name="bank-avg-soc-list",
    ),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/<int:rack_id>/stats/avg-rack-soc/",
        AvgESSRackSoCListView.as_view(),
        name="rack-avg-soc-list",
    ),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/stats/avg-bank-soh/",
        AvgESSBankSoHListView.as_view(),
        name="bank-avg-soh-list",
    ),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/<int:rack_id>/stats/avg-rack-soh/",
        AvgESSRackSoHListView.as_view(),
        name="rack-avg-soh-list",
    ),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/stats/avg-bank-power/",
        AvgESSBankPowerListView.as_view(),
        name="avg-bank-power-list",
    ),
    # ESS monitoring log list url
    path("search/", include(router.urls)),
    # Latest ESS model retrieve url
    path("operating-sites/<int:operating_site_id>/banks/<int:bank_id>/latest/", LatestESSBankView.as_view()),
    path(
        "operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/<int:rack_id>/latest/",
        LatestESSRackView.as_view(),
    ),
    path("operating-sites/<int:operating_site_id>/pcs/latest/", LatestESSPcsView.as_view()),
    path("operating-sites/<int:operating_site_id>/etc/latest/", LatestESSEtcView.as_view()),
    path("download/operating-sites/<int:operating_site_id>/<data_type>/", ESSOperatingDataDownloadView.as_view()),
    path("di/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/", DeIdentificationESSBankListView.as_view()),
    path(
        "di/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/",
        DeIdentificationESSRackListView.as_view(),
    ),
    path(
        "di/operating-sites/<int:operating_site_id>/pcs/",
        DeIdentificationESSPcsListView.as_view(),
    ),
    path(
        "di/operating-sites/<int:operating_site_id>/etc/",
        DeIdentificationESSEtcListView.as_view(),
    ),
    path(
        "di/operating-sites/<int:operating_site_id>/banks/<int:bank_id>/racks/<int:rack_id>",
        DeIdentificationESSRackDetailListView.as_view(),
    ),
    path(
        "download/di/operating-sites/<int:operating_site_id>/<data_type>/",
        DeIndentificationESSOperatingDataDownloadView.as_view(),
    ),
]
