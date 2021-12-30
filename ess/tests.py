from datetime import datetime, timedelta
from django.db import connections
from django.test import TestCase
from .models import Bank, Etc, Pcs, Rack
from .serializer import BankSerializer, RackSerializer, PcsSerializer, EtcSerializer


class BankTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_bank(self):
        limit10_bank = Bank.objects.all()[:10]

        self.assertEqual(len(limit10_bank), 10)

    def test_field_include_with_serializer(self):
        bank = Bank.objects.all()[:1]
        fields = ["timestamp", "bank_id", "bank_soc"]
        serializer = BankSerializer(bank, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))

    def test_avg_bank_soc_per_hour_by_date(self):
        with connections["ess"].cursor() as cursor:
            query = """
                SELECT time_bucket('1 hour', "TIMESTAMP") "time", AVG("BANK_SOC") avg_bank_soc 
                FROM bank 
                WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                GROUP BY "time" ORDER BY "time"
            """
            params = {"bank_id": 1, "start_date": "2021-10-20", "end_date": "2021-10-21"}

            cursor.execute(query, params)

            row = cursor.fetchall()

        self.assertEqual(len(row), 24)

    def test_daily_avg_bank_power_per_minute(self):
        with connections["ess"].cursor() as cursor:
            start_date = "2021-10-20"
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            query = """
                SELECT time_bucket('1minutes', "TIMESTAMP") "time", AVG("BANK_POWER") avg_bank_power
                FROM bank 
                WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                GROUP BY "time" ORDER BY "time"
            """

            params = {"bank_id": 1, "start_date": start_date, "end_date": end_date}

            cursor.execute(query, params)

            row = cursor.fetchall()

            self.assertEqual(len(row), 60 * 24)


class RackTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_rack(self):
        limit10_rack = Rack.objects.all()[:10]

        self.assertEqual(len(limit10_rack), 10)

    def test_field_include_with_serializer(self):
        rack = Rack.objects.all()[:1]
        fields = ["timestamp", "bank_id", "rack_id", "rack_soc"]
        serializer = RackSerializer(rack, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))

    def test_avg_rack_soc_per_hour_by_date(self):
        with connections["ess"].cursor() as cursor:
            query = """
                SELECT time_bucket('1 hour', "TIMESTAMP") "time", AVG("RACK_SOC") avg_rack_soc 
                FROM rack 
                WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                GROUP BY "time" ORDER BY "time"
            """
            params = {"bank_id": 1, "rack_id": 1, "start_date": "2021-10-20", "end_date": "2021-10-21"}

            cursor.execute(query, params)

            row = cursor.fetchall()

        self.assertEqual(len(row), 24)


class PcsTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_pcs(self):
        limit10_pcs = Pcs.objects.all()[:10]

        self.assertEqual(len(limit10_pcs), 10)

    def test_field_include_with_serializer(self):
        pcs = Pcs.objects.all()[:1]
        fields = ["timestamp", "bank_id", "dc_power"]
        serializer = PcsSerializer(pcs, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))


class EtcTestCase(TestCase):
    databases = {"ess"}

    def test_limit_count_etc(self):
        limit10_etc = Etc.objects.all()[:10]

        self.assertEqual(len(limit10_etc), 10)

    def test_field_include_with_serializer(self):
        etc = Etc.objects.all()[:1]
        fields = ["timestamp", "bank_id", "sensor1_temperature"]
        serializer = EtcSerializer(etc, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))
