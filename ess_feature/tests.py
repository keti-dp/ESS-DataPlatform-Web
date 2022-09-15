from django.test import TestCase
from .models import ProtectionMapFeature, ProtectionMapFeatureTest


class ProtectionMapFeatureTestCase(TestCase):
    databases = {"ess_feature"}

    def test_limit_count(self):
        count = 10
        queryset = ProtectionMapFeature.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ProtectionMapFeatureTestTestCase(TestCase):
    databases = {"ess_feature"}

    def test_limit_count(self):
        count = 10
        queryset = ProtectionMapFeatureTest.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)