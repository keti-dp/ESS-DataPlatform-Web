from django.urls import include, path
from rest_framework.routers import SimpleRouter
from .views import SimulationPipelineViewSet, SimulationPipelineRunViewSet, SimulationPipelineLogView

router = SimpleRouter()
router.register(r"pipelines", SimulationPipelineViewSet, basename="pipeline")
router.register(r"runs", SimulationPipelineRunViewSet, basename="run")


urlpatterns = [
    path("", include(router.urls)),
    path("get-log/", SimulationPipelineLogView.as_view(), name="log"),
]
