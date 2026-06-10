from django.urls import path
from .views import CustomUserRetrieveUpdateDestroyView


urlpatterns = [
    path("<int:pk>/", CustomUserRetrieveUpdateDestroyView.as_view(), name="user-detail-update-delete"),
]
