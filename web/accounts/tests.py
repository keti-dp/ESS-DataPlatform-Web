import os
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN
from rest_framework.test import APIClient, APITestCase


class CustomUserTests(APITestCase):
    def setUp(self):
        user_info = {
            "username": os.getenv("TEST_USER_NAME"),
            "password": os.getenv("TEST_USER_PASSWORD"),
        }

        self.client = APIClient()
        self.client.login(**user_info)

        # 테스트용 본인 user id를 입력하세요 (TEST_USER_NAME 계정의 실제 DB id)
        self.user_id = ""

    def test_owner_user_get_access_to_self_detail_url(self):
        response = self.client.get(f"/api/users/{self.user_id}/")

        self.assertEqual(response.status_code, HTTP_200_OK)

    def test_authenticated_user_get_access_to_another_user_detail_url(self):
        # 테스트용 타 사용자 user id를 입력하세요 (권한 비교용)
        user_id = ""

        response = self.client.get(f"/api/users/{user_id}/")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_anonymous_user_get_access_to_another_user_detail_url(self):
        client = APIClient()
        response = client.get(f"/api/users/{self.user_id}/")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_owner_user_put_access_to_self_update_url(self):
        response = self.client.get(f"/api/users/{self.user_id}/")
        self.assertEqual(response.data["is_pro_request_status"], False)

        response = self.client.put(f"/api/users/{self.user_id}/", data={"is_pro_request_status": True}, format="json")
        self.assertEqual(response.status_code, HTTP_200_OK)

        response = self.client.get(f"/api/users/{self.user_id}/")
        self.assertEqual(response.data["is_pro_request_status"], True)

    def test_authenticated_user_put_access_to_another_user_update_url(self):
        # 테스트용 타 사용자 user id를 입력하세요
        user_id = ""

        response = self.client.put(f"/api/users/{user_id}/", data={"is_pro_request_status": True}, format="json")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_anonymous_user_put_access_to_another_user_update_url(self):
        client = APIClient()
        response = client.put(f"/api/users/{self.user_id}/", data={"is_pro_request_status": True}, format="json")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_owner_user_delete_access_to_self_delete_url(self):
        response = self.client.delete(f"/api/users/{self.user_id}/")

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)

    def test_authenticated_user_delete_access_to_another_user_delete_url(self):
        # 테스트용 타 사용자 user id를 입력하세요
        user_id = ""

        response = self.client.delete(f"/api/users/{user_id}/")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_anonymous_user_delete_access_to_another_user_delete_url(self):
        client = APIClient()
        response = client.delete(f"/api/users/{self.user_id}/")

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)
