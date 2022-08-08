from django.db import models


class AvgBankSoH(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    date = models.DateField()
    value = models.FloatField()

    class Meta:
        db_table = "avg_bank_soh"
        constraints = [
            models.UniqueConstraint(fields=["operating_site", "bank_id", "date"], name="avg_bank_soh_unique")
        ]


class AvgRackSoH(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    date = models.DateField()
    value = models.FloatField()

    class Meta:
        db_table = "avg_rack_soh"
        constraints = [
            models.UniqueConstraint(
                fields=["operating_site", "bank_id", "rack_id", "date"], name="avg_rack_soh_unique"
            )
        ]


class ForecastingBankSoL(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    date = models.DateField()
    value = models.FloatField()
    top_limit_value = models.FloatField()
    bottom_limit_value = models.FloatField()

    class Meta:
        db_table = "forecasting_bank_sol"
        constraints = [
            models.UniqueConstraint(fields=["operating_site", "bank_id", "date"], name="forecasting_bank_sol_unique")
        ]
