from rest_framework.routers import SimpleRouter
from .views import ApplicationViewSet, OpenAPIViewSet, SubscriptionViewSet


router = SimpleRouter()
router.register(r"applications", ApplicationViewSet, basename="application")
router.register(r"apis", OpenAPIViewSet)
router.register(r"subscriptions", SubscriptionViewSet, basename="subscription")


urlpatterns = router.urls
