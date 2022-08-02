from django.test import TestCase
from .models import ForecastingBankSoL, ProtectionMapFeature


class ProtectionMapFeatureTestCase(TestCase):
    databases = {"ess_feature"}

    def test_limit_count(self):
        count = 10
        queryset = ProtectionMapFeature.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingBankSoLTestCase(TestCase):
    databases = {"ess_feature"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingBankSoL.objects.all()[:count]

        self.assertEqual(len(queryset), count)
