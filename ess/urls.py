from django.urls import path
from .views import BankListView, EtcListView, PcsListView, RackListView

urlpatterns = [
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/", BankListView.as_view(), name="bank-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/etc/", EtcListView.as_view(), name="etc-list"),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/pcs/", PcsListView.as_view()),
    path("operation-sites/<int:operation_num>/banks/<int:bank_id>/racks/", RackListView.as_view()),
]
