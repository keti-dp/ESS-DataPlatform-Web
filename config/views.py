import os
from django.views.generic import TemplateView
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler


class IndexView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "index.html"

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
        return Response({"view": "index"})


class DashboardView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "dashboard.html"

    @staticmethod
    def custom_exception_handler(exc, context):
        response = exception_handler(exc, context)

        if response.status_code in (
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ):

            return redirect(os.getenv("REDIRECT_TO_MAIN_WEB_LOGIN_URL") + "dashboard/")

        return response

    def get_exception_handler(self):
        return self.custom_exception_handler

    def get(self, request):
        return Response({"view": "dashboard"})
