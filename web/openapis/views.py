import json
import os
import requests as req
from django.http import Http404
from datetime import datetime, timedelta
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Application, OpenAPI, Subscription
from .serializers import ApplicationSerializer, OpenAPISerializer, SubscriptionSerializer
from accounts.permissions import IsOwner, IsPro

API_MANAGEMENT_URL = os.getenv("API_MANAGEMENT_URL")
API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH = os.getenv("API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH")
API_MANAGEMENT_DEVELOPER_PORTAL_URL = f"{API_MANAGEMENT_URL}{API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH}"
API_MANAGEMENT_ACCESS_TOKEN = os.getenv("API_MANAGEMENT_ACCESS_TOKEN")
OPENAPI_APPLICATION_NAME_MIN_SIZE = 3
OPENAPI_APPLICATION_NAME_MAX_SIZE = 50
OPENAPI_APPLICATION_THROTTLING_POLICY = "Unlimited"


class ApplicationViewSet(viewsets.ViewSet):
    def get_object(self, pk):
        try:
            return Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            raise Http404

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAdminUser]
        elif self.action == "create":
            permission_classes = [IsPro]
        else:
            permission_classes = [IsOwner, IsPro]

        return [permission() for permission in permission_classes]

    def list(self, request):
        queryset = Application.objects.all()
        serializer = ApplicationSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request):
        name = request.data["name"]
        if (
            name is None
            or len(name) < OPENAPI_APPLICATION_NAME_MIN_SIZE
            or len(name) > OPENAPI_APPLICATION_NAME_MAX_SIZE
        ):
            return Response(
                {
                    "code": 400,
                    "message": f"'name'은 {OPENAPI_APPLICATION_NAME_MIN_SIZE}~{OPENAPI_APPLICATION_NAME_MAX_SIZE}자리 사이의 값으로 반드시 입력해주세요.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        converted_name = f"{request.user.email}__{name}"
        throttling_policy = OPENAPI_APPLICATION_THROTTLING_POLICY

        # Create a new application
        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/applications"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }
        data = {"name": converted_name, "throttlingPolicy": throttling_policy}

        response = req.post(url, headers=headers, data=json.dumps(data))
        response_data = response.json()

        # Generate an application key
        if response.status_code == status.HTTP_201_CREATED:
            application_id = response_data["applicationId"]

            url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/applications/{application_id}/generate-keys"
            data = {"keyType": "PRODUCTION", "grantTypesToBeSupported": ["password", "client_credentials"]}

            response = req.post(url, headers=headers, data=json.dumps(data))
            response_data = response.json()

            # Generate an access token
            if response.status_code == status.HTTP_200_OK:
                key_mapping_id = response_data["keyMappingId"]
                consumer_secret = response_data["consumerSecret"]

                url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/applications/{application_id}/oauth-keys/{key_mapping_id}/generate-token"

                # 'validityPeriod' is required, but is not working because server default setting
                data = {"consumerSecret": consumer_secret, "validityPeriod": 3600}

                response = req.post(url, headers=headers, data=json.dumps(data))
                response_data = response.json()

                if response.status_code == status.HTTP_200_OK:
                    access_token = response_data["accessToken"]
                    access_token_validity_time = datetime.now() + timedelta(days=365 * 5)
                    user_id = request.user.id

                    data = {
                        "id": application_id,
                        "name": name,
                        "throttling_policy": throttling_policy,
                        "access_token": access_token,
                        "access_token_validity_time": access_token_validity_time,
                        "user": user_id,
                    }

                    serializer = ApplicationSerializer(data=data)

                    if serializer.is_valid():
                        serializer.save()

                        return Response(serializer.data, status=status.HTTP_201_CREATED)

                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data, status=response.status_code)

    def retrieve(self, request, pk=None):
        application = self.get_object(pk)

        if request.user != application.user:
            return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationSerializer(application)

        return Response(serializer.data)

    def destroy(self, request, pk=None):
        application = self.get_object(pk)

        if request.user != application.user:
            return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/applications/{application.id}"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
        }

        response = req.delete(url, headers=headers)

        if response.status_code == status.HTTP_200_OK:
            application.delete()

            return Response(status=status.HTTP_200_OK)

        return Response(status=response.status_code)


class OpenAPIViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OpenAPI.objects.all()
    serializer_class = OpenAPISerializer


class SubscriptionViewSet(viewsets.ViewSet):
    def get_object(self, pk):
        try:
            return Subscription.objects.get(pk=pk)
        except Subscription.DoesNotExist:
            raise Http404

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [IsPro]
        else:
            permission_classes = [IsOwner, IsPro]

        return [permission() for permission in permission_classes]

    def list(self, request):
        try:
            queryset = Subscription.objects.filter(user=request.user)
            application_id_param = request.query_params.get("application-id")

            if application_id_param:
                application = Application.objects.get(id=application_id_param)

                if application and application.user == request.user:
                    queryset = queryset.filter(application_id=application_id_param)
                else:
                    return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

            serializer = SubscriptionSerializer(queryset, many=True)

            return Response(serializer.data)
        except Application.DoesNotExist:
            return Response({"message": "Application이 존재하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        try:
            application = Application.objects.get(id=request.data["applicationId"])

            if request.user != application.user:
                return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

            openapi = OpenAPI.objects.get(id=request.data["openapiId"])

            throttling_policy = OPENAPI_APPLICATION_THROTTLING_POLICY

            headers = {
                "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
                "Content-Type": "application/json",
            }
            data = {"applicationId": application.id, "apiId": openapi.id, "throttlingPolicy": throttling_policy}

            response = req.post(
                url=f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/subscriptions", headers=headers, data=json.dumps(data)
            )
            response_data = response.json()

            if response.status_code == status.HTTP_201_CREATED:
                data = {
                    "id": response_data["subscriptionId"],
                    "throttling_policy": throttling_policy,
                    "application_id": response_data["applicationId"],
                    "openapi_id": response_data["apiId"],
                    "user_id": request.user.id,
                }

                subscription = Subscription.objects.create(**data)
                serializer = SubscriptionSerializer(subscription)

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(response_data, status=response.status_code)
        except Application.DoesNotExist:
            return Response({"message": "Application이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)
        except OpenAPI.DoesNotExist:
            return Response({"message": "OpenAPI가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, pk=None):
        subscription = self.get_object(pk)

        if request.user != subscription.user:
            return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        serializer = SubscriptionSerializer(subscription)

        return Response(serializer.data)

    def destroy(self, request, pk=None):
        subscription = self.get_object(pk)

        if request.user != subscription.user:
            return Response({"message": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/subscriptions/{subscription.id}"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
        }

        response = req.delete(url, headers=headers)

        if response.status_code == status.HTTP_200_OK:
            subscription.delete()

            return Response(status=status.HTTP_200_OK)

        return Response(status=response.status_code)
