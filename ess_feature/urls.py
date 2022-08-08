from django.urls import path
from .views import (
    ProtectionMapFeatureView,
    ProtectionMapFeatureAllListView,
    ProtectionMapFeatureLogLevelCountView,
)


urlpatterns = [
    path("protectionmap/", ProtectionMapFeatureAllListView.as_view()),
    path("protectionmap/operating-sites/<int:operating_site_id>/", ProtectionMapFeatureView.as_view()),
    path(
        "protectionmap/operating-sites/<int:operating_site_id>/stats/log-level-count/",
        ProtectionMapFeatureLogLevelCountView.as_view(),
    ),
]
