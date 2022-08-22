# Generated by Django 3.2.8 on 2022-08-04 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ess_stats', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AvgRackSoH',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operating_site', models.IntegerField(db_column='operating_site_id')),
                ('bank_id', models.IntegerField()),
                ('rack_id', models.IntegerField()),
                ('date', models.DateField()),
                ('value', models.FloatField()),
            ],
            options={
                'db_table': 'avg_rack_soh',
            },
        ),
        migrations.AddConstraint(
            model_name='avgracksoh',
            constraint=models.UniqueConstraint(fields=('operating_site', 'bank_id', 'rack_id', 'date'), name='avg_rack_soh_unique'),
        ),
    ]