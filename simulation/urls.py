from django.urls import path
from .views import SimulationView


urlpatterns = [
    path("run/", SimulationView.as_view()),
]
