import json
import os
import requests
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient, APITestCase


API_MANAGEMENT_URL = os.getenv("API_MANAGEMENT_URL")
API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH = os.getenv("API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH")
API_MANAGEMENT_DEVELOPER_PORTAL_URL = f"{API_MANAGEMENT_URL}{API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH}"
API_MANAGEMENT_ACCESS_TOKEN = os.getenv("API_MANAGEMENT_ACCESS_TOKEN")
API_MANAGEMENT_TEST_APPLICATION_ID = os.getenv("API_MANAGEMENT_TEST_APPLICATION_ID")
API_MANAGEMENT_TEST_API_ID = os.getenv("API_MANAGEMENT_TEST_API_ID")


class ApplicationTestCase(TestCase):
    def setUp(self):
        self.apim_url = os.getenv("API_MANAGEMENT_URL")
        self.apim_developer_portal_url_path = os.getenv("API_MANAGEMENT_DEVELOPER_PORTAL_URL_PATH")
        self.apim_developer_portal_url = f"{self.apim_url}{self.apim_developer_portal_url_path}"
        self.apim_access_token = os.getenv("API_MANAGEMENT_ACCESS_TOKEN")

    def test_get_the_applications_from_apim_system(self):
        url = f"{self.apim_developer_portal_url}/applications"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
        }

        response = requests.get(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_and_delete_a_new_application_to_apim_system(self):
        # Create a new application
        url = f"{self.apim_developer_portal_url}/applications"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
            "Content-Type": "application/json",
        }
        data = {
            "name": "Auto created test app",
            "throttlingPolicy": "Unlimited",
        }

        response = requests.post(url, headers=headers, data=json.dumps(data))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Delete a new application
        response_data = response.json()
        application_id = response_data["applicationId"]
        url = f"{self.apim_developer_portal_url}/applications/{application_id}"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
        }

        response = requests.delete(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_an_application_with_same_name_to_apim_system(self):
        # Create a new application with same name
        url = f"{self.apim_developer_portal_url}/applications"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
            "Content-Type": "application/json",
        }
        data = {
            "name": "Sample Application",
            "throttlingPolicy": "Unlimited",
        }

        response = requests.post(url, headers=headers, data=json.dumps(data))

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_get_an_access_token_from_apim_system(self):
        """
        Process:
            - 1. Create a new application
            - 2. Generate an application key
            - 3. Generate an access token
            - 4. Delete a new application
        """

        # Create a new application
        url = f"{self.apim_developer_portal_url}/applications"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
            "Content-Type": "application/json",
        }
        data = {
            "name": "Auto created test app",
            "throttlingPolicy": "Unlimited",
        }

        response = requests.post(url, headers=headers, data=json.dumps(data))
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Generate an application key
        application_id = response_data["applicationId"]

        url = f"{self.apim_developer_portal_url}/applications/{application_id}/generate-keys"
        data = {"keyType": "PRODUCTION", "grantTypesToBeSupported": ["password", "client_credentials"]}

        response = requests.post(url, headers=headers, data=json.dumps(data))
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Generate an access token
        key_mapping_id = response_data["keyMappingId"]
        consumer_secret = response_data["consumerSecret"]

        url = f"{self.apim_developer_portal_url}/applications/{application_id}/oauth-keys/{key_mapping_id}/generate-token"
        data = {"consumerSecret": consumer_secret, "validityPeriod": 3600}

        response = requests.post(url, headers=headers, data=json.dumps(data))
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete a new application
        url = f"{self.apim_developer_portal_url}/applications/{application_id}"
        headers = {
            "Authorization": f"Bearer {self.apim_access_token}",
        }

        response = requests.delete(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class OpenAPITestCase(APITestCase):
    def setUp(self):
        user_info = {
            "username": os.getenv("TEST_USER_NAME"),
            "password": os.getenv("TEST_USER_PASSWORD"),
        }

        self.client = APIClient()
        self.client.login(**user_info)

    def test_openapi_list_url(self):
        response = self.client.get("/api/openapi/apis/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_openapi_detail_url(self):
        response = self.client.get("/api/openapi/apis/")

        if response.status_code == status.HTTP_200_OK:
            data = response.json()

            self.assertGreater(len(data), 0)

            if data:
                api_id = data[0]["id"]

                response = self.client.get(f"/api/openapi/apis/{api_id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SubscriptionTestCase(APITestCase):
    def setUp(self):
        user_info = {
            "username": os.getenv("TEST_USER_NAME"),
            "password": os.getenv("TEST_USER_PASSWORD"),
        }

        self.client = APIClient()
        self.client.login(**user_info)

    def test_get_the_subscriptions_from_apim_system(self):
        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/subscriptions?apiId={API_MANAGEMENT_TEST_API_ID}"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
        }

        response = requests.get(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_and_delete_a_new_subscription_to_apim_system(self):
        # Create a new subscription
        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/subscriptions"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }
        data = {
            "applicationId": API_MANAGEMENT_TEST_APPLICATION_ID,
            "apiId": API_MANAGEMENT_TEST_API_ID,
            "throttlingPolicy": "Unlimited",
        }

        response = requests.post(url, headers=headers, data=json.dumps(data))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Delete a new subscription
        response_data = response.json()
        subscription_id = response_data["subscriptionId"]
        url = f"{API_MANAGEMENT_DEVELOPER_PORTAL_URL}/subscriptions/{subscription_id}"
        headers = {
            "Authorization": f"Bearer {API_MANAGEMENT_ACCESS_TOKEN}",
        }

        response = requests.delete(url, headers=headers)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
