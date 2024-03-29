# Generated by Django 3.2.8 on 2022-08-08 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ess_stats', '0003_auto_20220808_1432'),
    ]

    operations = [
        migrations.CreateModel(
            name='ForecastingRackMaxCellVoltage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operating_site', models.IntegerField(db_column='operating_site_id')),
                ('bank_id', models.IntegerField()),
                ('rack_id', models.IntegerField()),
                ('time', models.DateTimeField()),
                ('values', models.JSONField()),
            ],
            options={
                'db_table': 'forecasting_rack_max_cell_voltage',
            },
        ),
        migrations.AddConstraint(
            model_name='forecastingrackmaxcellvoltage',
            constraint=models.UniqueConstraint(fields=('operating_site', 'bank_id', 'rack_id', 'time'), name='forecasting_rack_max_cell_voltage_unique'),
        ),
    ]
