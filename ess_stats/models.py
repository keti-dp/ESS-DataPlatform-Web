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


class ForecastingMaxRackCellVoltage(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    time = models.DateTimeField(primary_key=True)
    values = models.JSONField()

    class Meta:
        managed = False
        db_table = "forecasting_max_rack_cell_voltage"


class ForecastingMinRackCellVoltage(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    time = models.DateTimeField(primary_key=True)
    values = models.JSONField()

    class Meta:
        managed = False
        db_table = "forecasting_min_rack_cell_voltage"


class ForecastingMaxRackCellTemperature(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    time = models.DateTimeField(primary_key=True)
    values = models.JSONField()

    class Meta:
        managed = False
        db_table = "forecasting_max_rack_cell_temperature"


class ForecastingMinRackCellTemperature(models.Model):
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    time = models.DateTimeField(primary_key=True)
    values = models.JSONField()

    class Meta:
        managed = False
        db_table = "forecasting_min_rack_cell_temperature"


class SoS(models.Model):
    time = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    operating_site = models.IntegerField(db_column="OPERATING_SITE")
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    over_voltage = models.FloatField(db_column="OVER_VOLTAGE")
    under_voltage = models.FloatField(db_column="UNDER_VOLTAGE")
    voltage_unbalance = models.FloatField(db_column="VOLTAGE_UNBALANCE")
    over_current = models.FloatField(db_column="OVER_CURRENT")
    over_temperature = models.FloatField(db_column="OVER_TEMPERATURE")
    under_temperature = models.FloatField(db_column="UNDER_TEMPERATURE")
    temperature_unbalance = models.FloatField(db_column="TEMPERATURE_UNBALANCE")
    sos_score = models.FloatField(db_column="SOS_SCORE")

    class Meta:
        managed = False
        db_table = "ess_sos"


class EXSoS(models.Model):
    time = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    mode = models.IntegerField(db_column="MODE", blank=True, null=True)
    operating_site = models.IntegerField(db_column="OPERATING_SITE", blank=True, null=True)
    bank_id = models.IntegerField(db_column="BANK_ID", blank=True, null=True)
    rack_id = models.IntegerField(db_column="RACK_ID", blank=True, null=True)
    integrated_safety = models.FloatField(db_column="INTEGRATED_SAFETY", blank=True, null=True)
    membership_degree = models.TextField(db_column="MEMBERSHIP_DEGREE", blank=True, null=True)
    membership_degree_detail = models.TextField(db_column="MEMBERSHIP_DEGREE_DETAIL", blank=True, null=True)

    class Meta:
        managed = False
        db_table = "ess_exsos"


class MultiStepForecastingMaxCellVoltage(models.Model):
    time = models.DateTimeField(primary_key=True)
    operating_site = models.IntegerField(db_column="operating_site_id", blank=True, null=True)
    bank_id = models.IntegerField(blank=True, null=True)
    rack_id = models.IntegerField(blank=True, null=True)
    values = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "multi_step_forecasting_maxvol"


class StaticChartData(models.Model):
    name = models.CharField(max_length=150)
    chart_type = models.CharField(max_length=150)
    values = models.JSONField()

    class Meta:
        db_table = "static_chart_data"


class ForecastingSoS(models.Model):
    time = models.DateTimeField(primary_key=True)
    operating_site = models.IntegerField(db_column="operating_site_id")
    bank_id = models.IntegerField()
    rack_id = models.IntegerField()
    values = models.JSONField(blank=True, null=True)
    version = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "forecasting_rack_sos"
        constraints = [
            models.UniqueConstraint(
                fields=["time", "operating_site", "bank_id", "rack_id"],
                name="forecasting_rack_sos_time_operating_site_id_bank_id_rack_id_key",
            )
        ]


class SoS(models.Model):
    time = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    operating_site = models.IntegerField(db_column="OPERATING_SITE")
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    over_voltage = models.FloatField(db_column="OVER_VOLTAGE")
    under_voltage = models.FloatField(db_column="UNDER_VOLTAGE")
    voltage_unbalance = models.FloatField(db_column="VOLTAGE_UNBALANCE")
    over_current = models.FloatField(db_column="OVER_CURRENT")
    over_temperature = models.FloatField(db_column="OVER_TEMPERATURE")
    under_temperature = models.FloatField(db_column="UNDER_TEMPERATURE")
    temperature_unbalance = models.FloatField(db_column="TEMPERATURE_UNBALANCE")
    sos_score = models.FloatField(db_column="SOS_SCORE")

    class Meta:
        managed = False
        db_table = "ess_sos"


class EXSoS(models.Model):
    time = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    mode = models.IntegerField(db_column="MODE", blank=True, null=True)
    operating_site = models.IntegerField(db_column="OPERATING_SITE", blank=True, null=True)
    bank_id = models.IntegerField(db_column="BANK_ID", blank=True, null=True)
    rack_id = models.IntegerField(db_column="RACK_ID", blank=True, null=True)
    integrated_safety = models.FloatField(db_column="INTEGRATED_SAFETY", blank=True, null=True)
    membership_degree = models.TextField(db_column="MEMBERSHIP_DEGREE", blank=True, null=True)
    membership_degree_detail = models.TextField(db_column="MEMBERSHIP_DEGREE_DETAIL", blank=True, null=True)

    class Meta:
        managed = False
        db_table = "ess_exsos"


class MultiStepForecastingMaxCellVoltage(models.Model):
    time = models.DateTimeField(primary_key=True)
    operating_site = models.IntegerField(db_column="operating_site_id", blank=True, null=True)
    bank_id = models.IntegerField(blank=True, null=True)
    rack_id = models.IntegerField(blank=True, null=True)
    values = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "multi_step_forecasting_maxvol"


class StaticChartData(models.Model):
    name = models.CharField(max_length=150)
    chart_type = models.CharField(max_length=150)
    values = models.JSONField()

    class Meta:
        db_table = "static_chart_data"
