from django.urls import path
from .views import BankListView, EtcListView, PcsListView, RackListView, BankAvgSoCListView, RackAvgSoCListView, BankAvgSoHListView, RackAvgSoHListView
from .views import (
    BankListView,
    EtcListView,
    PcsListView,
    RackListView,
    BankAvgSoCListView,
    RackAvgSoCListView,
    BankAvgSoHListView,
    RackAvgSoHListView
    AvgBankPowerListView,
)

urlpatterns = [
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/", BankListView.as_view(), name="bank-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/etc/", EtcListView.as_view(), name="etc-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/pcs/", PcsListView.as_view(), name="pcs-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/racks/", RackListView.as_view(), name="rack-list"),
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
]
