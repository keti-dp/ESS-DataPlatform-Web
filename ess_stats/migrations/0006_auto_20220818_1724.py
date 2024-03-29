# Generated by Django 3.2.8 on 2022-08-18 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ess_stats", "0005_auto_20220809_1552"),
    ]

    operations = [
        migrations.CreateModel(
            name="ForecastingMinRackCellVoltage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("operating_site", models.IntegerField(db_column="operating_site_id")),
                ("bank_id", models.IntegerField()),
                ("rack_id", models.IntegerField()),
                ("time", models.DateTimeField()),
                ("values", models.JSONField()),
            ],
            options={
                "db_table": "forecasting_min_rack_cell_voltage",
            },
        ),
        migrations.AddConstraint(
            model_name="forecastingminrackcellvoltage",
            constraint=models.UniqueConstraint(
                fields=("operating_site", "bank_id", "rack_id", "time"),
                name="forecasting_min_rack_cell_voltage_unique",
            ),
        ),
    ]
