from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from .views import APIUsageGuideView, IndexView, LoginView, MyView, OpenAPIDetailView, OpenAPIListView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", IndexView.as_view(), name="index"),
    path("login/", LoginView.as_view(), name="login"),
    path("accounts/", include("allauth.urls")),
    path("my/", MyView.as_view(), name="my"),
    path("api/users/", include("accounts.urls"), name="user"),
    path("api/openapi/", include("openapis.urls"), name="openapi"),
    path("apis/", OpenAPIListView.as_view(), name="openapi_list"),
    path("apis/<slug:slug>", OpenAPIDetailView.as_view(), name="openapi_detail"),
    path("api-usage-guide", APIUsageGuideView.as_view(), name="api_usage_guide"),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
