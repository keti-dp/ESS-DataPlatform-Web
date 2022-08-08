# Generated by Django 3.2.8 on 2022-08-08 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ess_stats', '0002_auto_20220804_1634'),
    ]

    operations = [
        migrations.CreateModel(
            name='ForecastingBankSoL',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operating_site', models.IntegerField(db_column='operating_site_id')),
                ('bank_id', models.IntegerField()),
                ('date', models.DateField()),
                ('value', models.FloatField()),
                ('top_limit_value', models.FloatField()),
                ('bottom_limit_value', models.FloatField()),
            ],
            options={
                'db_table': 'forecasting_bank_sol',
            },
        ),
        migrations.AddConstraint(
            model_name='forecastingbanksol',
            constraint=models.UniqueConstraint(fields=('operating_site', 'bank_id', 'date'), name='forecasting_bank_sol_unique'),
        ),
    ]
