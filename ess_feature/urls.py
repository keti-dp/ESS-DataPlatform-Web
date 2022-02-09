from django.urls import path
from .views import ProtectionMapFeatureView, ProtectionMapFeatureAllListView


urlpatterns = [
    path("protectionmap/", ProtectionMapFeatureAllListView.as_view()),
    path("protectionmap/operating-sites/<int:operating_site_id>/", ProtectionMapFeatureView.as_view()),
]
