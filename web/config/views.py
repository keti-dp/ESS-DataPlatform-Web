from django.core import serializers
from django.views.generic import TemplateView, DetailView
from django.shortcuts import redirect, render
from openapis.models import Application, OpenAPI


class IndexView(TemplateView):
    template_name = "index.html"


class LoginView(TemplateView):
    template_name = "login.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("index")

        return super().get(request, *args, **kwargs)


class MyView(TemplateView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("login")

        applications = Application.objects.filter(user=request.user)

        context = super().get_context_data(**kwargs)
        context["application_list"] = applications

        return render(request, template_name="my.html", context=context)


class OpenAPIListView(TemplateView):
    def get(self, request, *args, **kwargs):
        openapis = OpenAPI.objects.all().order_by("name")

        context = super().get_context_data(**kwargs)
        context["openapi_list"] = openapis

        return render(request, template_name="openapi_list.html", context=context)


class OpenAPIDetailView(DetailView):
    queryset = OpenAPI.objects.all()
    template_name = "openapi_detail.html"


class APIUsageGuideView(TemplateView):
    template_name = "api_usage_guide.html"
