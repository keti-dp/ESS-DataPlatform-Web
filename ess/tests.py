from django.test import TestCase
from .models import Bank, Etc, Pcs, Rack


class ESSTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_bank(self):
        limit10_bank = Bank.objects.all()[:10]

        self.assertEqual(len(limit10_bank), 10)


class RackTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_rack(self):
        limit10_rack = Rack.objects.all()[:10]

        self.assertEqual(len(limit10_rack), 10)


class PcsTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_pcs(self):
        limit10_pcs = Pcs.objects.all()[:10]

        self.assertEqual(len(limit10_pcs), 10)


class EtcTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_etc(self):
        limit10_etc = Etc.objects.all()[:10]

        self.assertEqual(len(limit10_etc), 10)
