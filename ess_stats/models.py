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
