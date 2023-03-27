import os
import json
from django.views.generic import TemplateView
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler


class IndexView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    @staticmethod
    def custom_exception_handler(exc, context):
        response = exception_handler(exc, context)

        if response.status_code in (
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ):

            return redirect(os.getenv("REDIRECT_TO_MAIN_WEB_LOGIN_URL"))

        return response

    def get_exception_handler(self):
        return self.custom_exception_handler

    def get(self, request):
        template_name = "index.html"

        if "/en/" in request.path:
            template_name = f"en/{template_name}"

        with open("ess_protection_map.json", encoding="utf-8") as f:
            ess_protection_map = json.load(f)

        return Response(
            {
                "ess_protection_map": ess_protection_map,
            },
            template_name=template_name,
        )


class DataMonitoringView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    @staticmethod
    def custom_exception_handler(exc, context):
        response = exception_handler(exc, context)

        if response.status_code in (
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ):

            return redirect(os.getenv("REDIRECT_TO_MAIN_WEB_LOGIN_URL") + "data-monitoring/")

        return response

    def get_exception_handler(self):
        return self.custom_exception_handler

    def get(self, request):
        template_name = "monitoring/data_monitoring.html"

        if "/en/" in request.path:
            template_name = f"en/{template_name}"

        with open("ess_protection_map.json", encoding="utf-8") as f:
            ess_protection_map = json.load(f)

        return Response({"ess_protection_map": ess_protection_map}, template_name=template_name)


class DemoView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    @staticmethod
    def custom_exception_handler(exc, context):
        response = exception_handler(exc, context)

        if response.status_code in (
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ):

            return redirect(os.getenv("REDIRECT_TO_MAIN_WEB_LOGIN_URL") + "data-monitoring/")

        return response

    def get_exception_handler(self):
        return self.custom_exception_handler

    def get(self, request):
        template_name = "demo.html"

        if "/en/" in request.path:
            template_name = f"en/{template_name}"

        return Response(template_name=template_name)
