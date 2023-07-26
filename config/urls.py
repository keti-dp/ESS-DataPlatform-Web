"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from .views import DataMonitoringView, DemoView, IndexView, SimulationView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", IndexView.as_view(), name="index"),
    path("api/ess/stats/", include("ess_stats.urls"), name="ess-stats"),
    path("api/ess/", include("ess.urls"), name="ess"),
    path("api/ess-feature/", include("ess_feature.urls"), name="ess-feature"),
    path("api/simulation/", include("simulation.urls"), name="ess-simulation"),
    path("data-monitoring/", DataMonitoringView.as_view(), name="data-monitoring"),
    path("demo/", DemoView.as_view(), name="demo"),
    path("simulation/", SimulationView.as_view(), name="simulation"),
]

# Add english url patterns
urlpatterns += [
    path("en/data-monitoring/", DataMonitoringView.as_view(), name="en-data-monitoring"),
    path("en/demo/", DemoView.as_view(), name="en-demo"),
    path("en/simulation/", SimulationView.as_view(), name="en-simulation"),
    path("en/", IndexView.as_view(), name="en-index"),
]

# Add english url patterns
urlpatterns += [
    path("en/data-monitoring/", DataMonitoringView.as_view(), name="en-data-monitoring"),
    path("en/demo/", DemoView.as_view(), name="en-demo"),
    path("en/", IndexView.as_view(), name="en-index"),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
