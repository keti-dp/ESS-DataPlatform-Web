# Generated by Django 3.2.8 on 2022-08-08 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProtectionMapErrorCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'protectionmap_error_code',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProtectionMapFeature',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('bank_id', models.IntegerField(db_column='BANK_ID')),
                ('rack_id', models.IntegerField(db_column='RACK_ID')),
                ('operating_site', models.IntegerField(db_column='OPERATING_SITE')),
                ('description', models.CharField(blank=True, db_column='DESCRIPTION', max_length=300, null=True)),
            ],
            options={
                'db_table': 'protectionmap_feature_new',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProtectionMapLevel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'protectionmap_level',
                'managed': False,
            },
        ),
    ]