from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory, TestCase
from accounts.models import CustomUser
from rest_framework import status
from openapis.models import OpenAPI
from .views import IndexView, MyView, OpenAPIDetailView, OpenAPIListView


class IndexViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_access_to_index_url(self):
        request = self.factory.get("")
        response = IndexView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MyViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_access_to_my_url_by_anonymous_user(self):
        request = self.factory.get("/my")
        request.user = AnonymousUser()
        response = MyView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

    def test_access_to_my_url_by_authenticated_user(self):
        request = self.factory.get("/my")
        request.user = CustomUser.objects.all()[0]
        response = MyView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class OpenAPIListViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_access_to_api_list_url(self):
        request = self.factory.get("apis")
        response = OpenAPIListView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class OpenAPIDetailViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_access_to_api_detail_url(self):
        queryset = OpenAPI.objects.all()[:1]
        sample_openapi = queryset[0]

        request = self.factory.get("apis/")
        response = OpenAPIDetailView.as_view()(request, slug=sample_openapi.slug)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
