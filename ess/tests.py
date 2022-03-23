from datetime import datetime, timedelta
from django.db import connections
from django.test import TestCase

# This custom module have dynamic ess models, serializers, data_dates
from .ess_collections import (
    ESS_BANK,
    ESS_RACK,
    ESS_PCS,
    ESS_ETC,
    ESS_BANK_SERIALIZER,
    ESS_RACK_SERIALIZER,
    ESS_PCS_SERIALIZER,
    ESS_ETC_SERIALIZER,
    ESS_DATA_DATE,
)

DATABASES = {"ess1", "ess2"}
TEST_DATABASE = "ess1"


class BankTestCase(TestCase):
    databases = DATABASES

    def test_limit_count_bank(self):
        limit10_bank = ESS_BANK[TEST_DATABASE].objects.using(TEST_DATABASE).all().order_by("-timestamp")[:10]

        self.assertEqual(len(limit10_bank), 10)

    def test_field_include_with_serializer(self):
        bank = ESS_BANK[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:1]
        fields = ["timestamp", "bank_id", "bank_soc"]
        serializer = ESS_BANK_SERIALIZER[TEST_DATABASE](bank, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))

    def test_avg_bank_soc_per_minute_by_date(self):

        with connections[TEST_DATABASE].cursor() as cursor:
            start_date = ESS_DATA_DATE[TEST_DATABASE]
            end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

            query = """
                SELECT time_bucket('1 minute', "TIMESTAMP") "time", AVG("BANK_SOC") avg_bank_soc 
                FROM bank 
                WHERE "BANK_ID" = %(bank_id)s AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                GROUP BY "time" ORDER BY "time"
            """
            params = {"bank_id": 1, "start_date": start_date, "end_date": end_date}

            cursor.execute(query, params)

            row = cursor.fetchall()

        self.assertGreaterEqual(len(row), 100)

    def test_daily_avg_bank_power_per_minute(self):

        with connections[TEST_DATABASE].cursor() as cursor:
            start_date = ESS_DATA_DATE[TEST_DATABASE]
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

            self.assertGreaterEqual(len(row), 100)


class RackTestCase(TestCase):
    databases = DATABASES

    def test_limit_count_rack(self):
        limit10_rack = ESS_RACK[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:10]

        self.assertEqual(len(limit10_rack), 10)

    def test_field_include_with_serializer(self):
        rack = ESS_RACK[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:1]
        fields = ["timestamp", "bank_id", "rack_id", "rack_soc"]
        serializer = ESS_RACK_SERIALIZER[TEST_DATABASE](rack, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))

    def test_avg_rack_soc_per_minute_by_date(self):
        start_date = ESS_DATA_DATE[TEST_DATABASE]
        end_date = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)

        with connections[TEST_DATABASE].cursor() as cursor:
            query = """
                SELECT time_bucket('1 minute', "TIMESTAMP") "time", AVG("RACK_SOC") avg_rack_soc 
                FROM rack 
                WHERE ("BANK_ID" = %(bank_id)s AND "RACK_ID" = %(rack_id)s) AND "TIMESTAMP" BETWEEN %(start_date)s AND %(end_date)s 
                GROUP BY "time" ORDER BY "time"
            """
            params = {"bank_id": 1, "rack_id": 1, "start_date": start_date, "end_date": end_date}

            cursor.execute(query, params)

            row = cursor.fetchall()

        self.assertGreaterEqual(len(row), 10)


class PcsTestCase(TestCase):
    databases = DATABASES

    def test_limit_count_pcs(self):
        limit10_pcs = ESS_PCS[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:10]

        self.assertEqual(len(limit10_pcs), 10)

    def test_field_include_with_serializer(self):
        pcs = ESS_PCS[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:1]
        fields = ["timestamp"]
        serializer = ESS_PCS_SERIALIZER[TEST_DATABASE](pcs, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))


class EtcTestCase(TestCase):
    databases = DATABASES

    def test_limit_count_etc(self):
        limit10_etc = ESS_ETC[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:10]

        self.assertEqual(len(limit10_etc), 10)

    def test_field_include_with_serializer(self):
        etc = ESS_ETC[TEST_DATABASE].objects.using(TEST_DATABASE).all()[:1]
        fields = ["timestamp", "sensor1_temperature", "sensor1_humidity"]
        serializer = ESS_ETC_SERIALIZER[TEST_DATABASE](etc, fields=fields, many=True)

        self.assertEqual(len(serializer.data[0]), len(fields))
