from django.db import models


class ProtectionMapErrorCode(models.Model):
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "protectionmap_error_code"


class ProtectionMapLevel(models.Model):
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "protectionmap_level"


class ProtectionMapFeature(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    error_code = models.ForeignKey(ProtectionMapErrorCode, on_delete=models.PROTECT, db_column="ERROR_CODE")
    level = models.ForeignKey(ProtectionMapLevel, on_delete=models.PROTECT, db_column="LEVEL")
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    operating_site = models.IntegerField(db_column="OPERATING_SITE")

    class Meta:
        managed = False
        db_table = "protectionmap_feature"


class ForecastingBankSoL(models.Model):
    date = models.DateField(db_column="date")
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField(db_column="bank_id")
    forecasting_sol = models.FloatField(db_column="forecasting_sol")
    forecasting_sol_top_limit = models.FloatField(db_column="forecasting_sol_top_limit", null=True)
    forecasting_sol_bottom_limit = models.FloatField(db_column="forecasting_sol_bottom_limit", null=True)

    class Meta:
        managed = False
        db_table = "forecasting_bank_sol"
        constraints = [
            models.UniqueConstraint(fields=["date", "operating_site", "bank_id"], name="forecasting_bank_sol_unique")
        ]
