from django.urls import include, path
from rest_framework.routers import SimpleRouter
from .views import SimulationView, SimulationPipelineViewSet

router = SimpleRouter()
router.register(r"pipelines", SimulationPipelineViewSet, basename="pipeline")


urlpatterns = [
    path("run/", SimulationView.as_view()),
    path("", include(router.urls)),
]
