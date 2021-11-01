from django.urls import path
from .views import BankListView, EtcListView, PcsListView, RackListView, BankAvgSoCListView, RackAvgSoCListView

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
]
