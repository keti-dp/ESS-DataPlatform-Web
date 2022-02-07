from django.urls import path
from .views import ProtectionMapFeatureView


urlpatterns = [
    path("protectionmap/operating-sites/<int:operating_site_id>/", ProtectionMapFeatureView.as_view()),
]
