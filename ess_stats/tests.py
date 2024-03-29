from django.test import TestCase
from .models import (
    AvgBankSoH,
    AvgRackSoH,
    ForecastingBankSoL,
    ForecastingMaxRackCellVoltage,
    ForecastingMinRackCellVoltage,
    ForecastingMaxRackCellTemperature,
    ForecastingMinRackCellTemperature,
    SoS,
    EXSoS,
    MultiStepForecastingMaxCellVoltage,
    StaticChartData,
    ForecastingSoS,
    SoCP,
)


class AvgBankSoHTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = AvgBankSoH.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class AvgRackSoHTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = AvgRackSoH.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingBankSoLTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingBankSoL.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingMaxRackCellVoltageTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingMaxRackCellVoltage.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingMinRackCellVoltageTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingMinRackCellVoltage.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingMaxRackCellTemperatureTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingMaxRackCellTemperature.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingMinRackCellTemperatureTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingMinRackCellTemperature.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class SoSTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = SoS.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class EXSoSTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = EXSoS.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class MultiStepForecastingMaxCellVoltageTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = MultiStepForecastingMaxCellVoltage.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class StaticChartDataTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = StaticChartData.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class ForecastingSoSTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = ForecastingSoS.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)


class SoCPTestCase(TestCase):
    databases = {"ess_stats"}

    def test_limit_count(self):
        count = 10
        queryset = SoCP.objects.all()[:count]

        self.assertGreaterEqual(len(queryset), 0)
