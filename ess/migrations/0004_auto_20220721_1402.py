# Generated by Django 3.2.8 on 2022-07-21 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ess', '0003_secondessbank_secondessetc_secondesspcs_secondessrack'),
    ]

    operations = [
        migrations.CreateModel(
            name='ESS2Bank',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('bank_id', models.IntegerField(db_column='BANK_ID')),
                ('bank_soc', models.FloatField(blank=True, db_column='BANK_SOC', null=True)),
                ('bank_soh', models.FloatField(blank=True, db_column='BANK_SOH', null=True)),
                ('bank_dc_volt', models.FloatField(blank=True, db_column='BANK_DC_VOLT', null=True)),
                ('bank_dc_current', models.FloatField(blank=True, db_column='BANK_DC_CURRENT', null=True)),
                ('max_cell_voltage_of_bank', models.FloatField(blank=True, db_column='MAX_CELL_VOLTAGE_OF_BANK', null=True)),
                ('min_cell_voltage_of_bank', models.FloatField(blank=True, db_column='MIN_CELL_VOLTAGE_OF_BANK', null=True)),
                ('max_cell_temperature_of_bank', models.FloatField(blank=True, db_column='MAX_CELL_TEMPERATURE_OF_BANK', null=True)),
                ('min_cell_temperature_of_bank', models.FloatField(blank=True, db_column='MIN_CELL_TEMPERATURE_OF_BANK', null=True)),
                ('bank_power', models.FloatField(blank=True, db_column='BANK_POWER', null=True)),
                ('rack_temperature_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_TEMPERATURE_IMBALANCE_WARNING', null=True)),
                ('rack_under_temperature_warning', models.IntegerField(blank=True, db_column='RACK_UNDER_TEMPERATURE_WARNING', null=True)),
                ('rack_over_temperature_warning', models.IntegerField(blank=True, db_column='RACK_OVER_TEMPERATURE_WARNING', null=True)),
                ('rack_voltage_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_VOLTAGE_IMBALANCE_WARNING', null=True)),
                ('rack_under_voltage_protection_warning', models.IntegerField(blank=True, db_column='RACK_UNDER_VOLTAGE_PROTECTION_WARNING', null=True)),
                ('rack_over_voltage_protection_warning', models.IntegerField(blank=True, db_column='RACK_OVER_VOLTAGE_PROTECTION_WARNING', null=True)),
                ('rack_over_current_charge_warning', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_CHARGE_WARNING', null=True)),
                ('rack_over_current_discharge_warning', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_DISCHARGE_WARNING', null=True)),
                ('rack_temperature_imbalance_fault', models.IntegerField(blank=True, db_column='RACK_TEMPERATURE_IMBALANCE_FAULT', null=True)),
                ('rack_under_temperature_fault', models.IntegerField(blank=True, db_column='RACK_UNDER_TEMPERATURE_FAULT', null=True)),
                ('rack_over_temperature_fault', models.IntegerField(blank=True, db_column='RACK_OVER_TEMPERATURE_FAULT', null=True)),
                ('rack_voltage_imbalance_fault', models.IntegerField(blank=True, db_column='RACK_VOLTAGE_IMBALANCE_FAULT', null=True)),
                ('rack_under_voltage_protection_fault', models.IntegerField(blank=True, db_column='RACK_UNDER_VOLTAGE_PROTECTION_FAULT', null=True)),
                ('rack_over_voltage_protection_fault', models.IntegerField(blank=True, db_column='RACK_OVER_VOLTAGE_PROTECTION_FAULT', null=True)),
                ('rack_over_current_charge_fault', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_CHARGE_FAULT', null=True)),
                ('rack_over_current_discharge_fault', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_DISCHARGE_FAULT', null=True)),
                ('rack_charge_relay_plus_fault_status', models.IntegerField(blank=True, db_column='RACK_CHARGE_RELAY_PLUS_FAULT_STATUS', null=True)),
                ('rack_discharge_relay_minus_fault_status', models.IntegerField(blank=True, db_column='RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS', null=True)),
                ('rack_fuse_minus_fault_status', models.IntegerField(blank=True, db_column='RACK_FUSE_MINUS_FAULT_STATUS', null=True)),
                ('rack_fuse_plus_fault_status', models.IntegerField(blank=True, db_column='RACK_FUSE_PLUS_FAULT_STATUS', null=True)),
                ('rack_tray_rack_communication_fault', models.IntegerField(blank=True, db_column='RACK_TRAY_RACK_COMMUNICATION_FAULT', null=True)),
                ('battery_status_for_run', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_RUN', null=True)),
                ('battery_status_for_charge', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_CHARGE', null=True)),
                ('battery_status_for_fault', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_FAULT', null=True)),
                ('battery_status_for_warning', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_WARNING', null=True)),
                ('max_module_temperature', models.FloatField(blank=True, db_column='MAX_MODULE_TEMPERATURE', null=True)),
                ('min_module_temperature', models.FloatField(blank=True, db_column='MIN_MODULE_TEMPERATURE', null=True)),
                ('max_module_humidity', models.FloatField(blank=True, db_column='MAX_MODULE_HUMIDITY', null=True)),
                ('min_module_humidity', models.FloatField(blank=True, db_column='MIN_MODULE_HUMIDITY', null=True)),
                ('rack_tray_voltage_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_TRAY_VOLTAGE_IMBALANCE_WARNING', null=True)),
                ('master_rack_communication_fault', models.TextField(blank=True, db_column='MASTER_RACK_COMMUNICATION_FAULT', default='')),
                ('battery_status_for_standby', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_STANDBY', null=True)),
                ('battery_status_for_discharge', models.IntegerField(blank=True, db_column='BATTERY_STATUS_FOR_DISCHARGE', null=True)),
                ('rack_to_master_bms_communication_status', models.IntegerField(blank=True, db_column='RACK_TO_MASTER_BMS_COMMUNICATION_STATUS', null=True)),
                ('charging_stop_of_status', models.IntegerField(blank=True, db_column='CHARGING_STOP_OF_STATUS', null=True)),
                ('discharging_stop_of_status', models.IntegerField(blank=True, db_column='DISCHARGING_STOP_OF_STATUS', null=True)),
                ('emergency_status', models.IntegerField(blank=True, db_column='EMERGENCY_STATUS', null=True)),
                ('tvoc_status', models.IntegerField(blank=True, db_column='TVOC_STATUS', null=True)),
                ('order_source', models.IntegerField(blank=True, db_column='ORDER_SOURCE', null=True)),
                ('emergency_source', models.IntegerField(blank=True, db_column='EMERGENCY_SOURCE', null=True)),
            ],
            options={
                'db_table': 'bank',
                'abstract': False,
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ESS2Etc',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('sensor1_temperature', models.FloatField(blank=True, db_column='SENSOR1_TEMPERATURE', null=True)),
                ('sensor1_humidity', models.FloatField(blank=True, db_column='SENSOR1_HUMIDITY', null=True)),
                ('sensor2_temperature', models.FloatField(blank=True, db_column='SENSOR2_TEMPERATURE', null=True)),
                ('sensor2_humidity', models.FloatField(blank=True, db_column='SENSOR2_HUMIDITY', null=True)),
                ('active_power_total', models.FloatField(blank=True, db_column='ACTIVE_POWER_TOTAL', null=True)),
                ('active_energy_total_high', models.FloatField(blank=True, db_column='ACTIVE_ENERGY_TOTAL_HIGH', null=True)),
            ],
            options={
                'db_table': 'etc',
                'abstract': False,
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ESS2Pcs',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('ai_vdc', models.FloatField(blank=True, db_column='AI_VDC', null=True)),
                ('ai_idc', models.FloatField(blank=True, db_column='AI_IDC', null=True)),
                ('ai_pdc', models.FloatField(blank=True, db_column='AI_PDC', null=True)),
                ('ai_freq', models.FloatField(blank=True, db_column='AI_FREQ', null=True)),
                ('ai_vab_rms', models.FloatField(blank=True, db_column='AI_VAB_RMS', null=True)),
                ('ai_vbc_rms', models.FloatField(blank=True, db_column='AI_VBC_RMS', null=True)),
                ('ai_vca_rms', models.FloatField(blank=True, db_column='AI_VCA_RMS', null=True)),
                ('ai_ias_rms', models.FloatField(blank=True, db_column='AI_IAS_RMS', null=True)),
                ('ai_ibs_rms', models.FloatField(blank=True, db_column='AI_IBS_RMS', null=True)),
                ('ai_ics_rms', models.FloatField(blank=True, db_column='AI_ICS_RMS', null=True)),
                ('ai_sac', models.FloatField(blank=True, db_column='AI_SAC', null=True)),
                ('ai_pac', models.FloatField(blank=True, db_column='AI_PAC', null=True)),
                ('ai_qac', models.FloatField(blank=True, db_column='AI_QAC', null=True)),
                ('ai_pf', models.FloatField(blank=True, db_column='AI_PF', null=True)),
                ('ai_c_kwh_ach', models.FloatField(blank=True, db_column='AI_C_KWH_ACH', null=True)),
                ('ai_c_kwh_acl', models.FloatField(blank=True, db_column='AI_C_KWH_ACL', null=True)),
                ('ai_d_kwh_ach', models.FloatField(blank=True, db_column='AI_D_KWH_ACH', null=True)),
                ('ai_d_kwh_acl', models.FloatField(blank=True, db_column='AI_D_KWH_ACL', null=True)),
                ('ai_c_kwh_dch', models.FloatField(blank=True, db_column='AI_C_KWH_DCH', null=True)),
                ('ai_c_kwh_dcl', models.FloatField(blank=True, db_column='AI_C_KWH_DCL', null=True)),
                ('ai_d_kwh_dch', models.FloatField(blank=True, db_column='AI_D_KWH_DCH', null=True)),
                ('ai_d_kwh_dcl', models.FloatField(blank=True, db_column='AI_D_KWH_DCL', null=True)),
                ('cmd_kw', models.FloatField(blank=True, db_column='CMD_KW', null=True)),
                ('cmd_kvar', models.FloatField(blank=True, db_column='CMD_KVAR', null=True)),
                ('cmd_vdc_ref', models.FloatField(blank=True, db_column='CMD_VDC_REF', null=True)),
                ('st_run', models.FloatField(blank=True, db_column='ST_RUN', null=True)),
                ('st_stop', models.FloatField(blank=True, db_column='ST_STOP', null=True)),
                ('st_ready', models.FloatField(blank=True, db_column='ST_READY', null=True)),
                ('st_mode_l_r', models.FloatField(blank=True, db_column='ST_MODE_L_R', null=True)),
                ('st_mode_cv', models.FloatField(blank=True, db_column='ST_MODE_CV', null=True)),
                ('st_fault', models.FloatField(blank=True, db_column='ST_FAULT', null=True)),
                ('st_charge', models.FloatField(blank=True, db_column='ST_CHARGE', null=True)),
                ('st_discharge', models.FloatField(blank=True, db_column='ST_DISCHARGE', null=True)),
                ('di_dk', models.FloatField(blank=True, db_column='DI_DK', null=True)),
                ('di_ak', models.FloatField(blank=True, db_column='DI_AK', null=True)),
                ('di_ck', models.FloatField(blank=True, db_column='DI_CK', null=True)),
                ('di_temp', models.FloatField(blank=True, db_column='DI_TEMP', null=True)),
                ('di_spd', models.FloatField(blank=True, db_column='DI_SPD', null=True)),
                ('di_ds', models.FloatField(blank=True, db_column='DI_DS', null=True)),
                ('di_start', models.FloatField(blank=True, db_column='DI_START', null=True)),
                ('di_es', models.FloatField(blank=True, db_column='DI_ES', null=True)),
                ('flt_ovar', models.FloatField(blank=True, db_column='FLT_OVAR', null=True)),
                ('flt_uvar', models.FloatField(blank=True, db_column='FLT_UVAR', null=True)),
                ('flt_ofr', models.FloatField(blank=True, db_column='FLT_OFR', null=True)),
                ('flt_ufr', models.FloatField(blank=True, db_column='FLT_UFR', null=True)),
                ('flt_ocar', models.FloatField(blank=True, db_column='FLT_OCAR', null=True)),
                ('flt_ovdr', models.FloatField(blank=True, db_column='FLT_OVDR', null=True)),
                ('flt_uvdr', models.FloatField(blank=True, db_column='FLT_UVDR', null=True)),
                ('flt_ocdr', models.FloatField(blank=True, db_column='FLT_OCDR', null=True)),
                ('flt_cfd', models.FloatField(blank=True, db_column='FLT_CFD', null=True)),
                ('flt_otr', models.FloatField(blank=True, db_column='FLT_OTR', null=True)),
                ('flt_spd', models.FloatField(blank=True, db_column='FLT_SPD', null=True)),
                ('flt_rvet', models.FloatField(blank=True, db_column='FLT_RVET', null=True)),
            ],
            options={
                'db_table': 'pcs',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ESS2Rack',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('bank_id', models.IntegerField(db_column='BANK_ID')),
                ('rack_id', models.IntegerField(db_column='RACK_ID')),
                ('rack_soc', models.FloatField(blank=True, db_column='RACK_SOC', null=True)),
                ('rack_soh', models.FloatField(blank=True, db_column='RACK_SOH', null=True)),
                ('rack_voltage', models.FloatField(blank=True, db_column='RACK_VOLTAGE', null=True)),
                ('rack_current', models.FloatField(blank=True, db_column='RACK_CURRENT', null=True)),
                ('rack_max_cell_voltage', models.FloatField(blank=True, db_column='RACK_MAX_CELL_VOLTAGE', null=True)),
                ('rack_max_cell_voltage_position', models.FloatField(blank=True, db_column='RACK_MAX_CELL_VOLTAGE_POSITION', null=True)),
                ('rack_min_cell_voltage', models.FloatField(blank=True, db_column='RACK_MIN_CELL_VOLTAGE', null=True)),
                ('rack_min_cell_voltage_position', models.FloatField(blank=True, db_column='RACK_MIN_CELL_VOLTAGE_POSITION', null=True)),
                ('rack_cell_voltage_gap', models.FloatField(blank=True, db_column='RACK_CELL_VOLTAGE_GAP', null=True)),
                ('rack_cell_voltage_average', models.FloatField(blank=True, db_column='RACK_CELL_VOLTAGE_AVERAGE', null=True)),
                ('rack_max_cell_temperature', models.FloatField(blank=True, db_column='RACK_MAX_CELL_TEMPERATURE', null=True)),
                ('rack_max_cell_temperature_position', models.FloatField(blank=True, db_column='RACK_MAX_CELL_TEMPERATURE_POSITION', null=True)),
                ('rack_min_cell_temperature', models.FloatField(blank=True, db_column='RACK_MIN_CELL_TEMPERATURE', null=True)),
                ('rack_min_cell_temperature_position', models.FloatField(blank=True, db_column='RACK_MIN_CELL_TEMPERATURE_POSITION', null=True)),
                ('rack_cell_temperature_gap', models.FloatField(blank=True, db_column='RACK_CELL_TEMPERATURE_GAP', null=True)),
                ('rack_discharge_relay_minus_status', models.IntegerField(blank=True, db_column='RACK_DISCHARGE_RELAY_MINUS_STATUS', null=True)),
                ('rack_charge_relay_plus_status', models.IntegerField(blank=True, db_column='RACK_CHARGE_RELAY_PLUS_STATUS', null=True)),
                ('rack_cell_balance_status', models.IntegerField(blank=True, db_column='RACK_CELL_BALANCE_STATUS', null=True)),
                ('rack_current_sensor_discharge', models.IntegerField(blank=True, db_column='RACK_CURRENT_SENSOR_DISCHARGE', null=True)),
                ('rack_current_sensor_charge', models.IntegerField(blank=True, db_column='RACK_CURRENT_SENSOR_CHARGE', null=True)),
                ('rack_status_for_run', models.IntegerField(blank=True, db_column='RACK_STATUS_FOR_RUN', null=True)),
                ('rack_status_for_fault', models.IntegerField(blank=True, db_column='RACK_STATUS_FOR_FAULT', null=True)),
                ('rack_status_for_warning', models.IntegerField(blank=True, db_column='RACK_STATUS_FOR_WARNING', null=True)),
                ('rack_temperature_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_TEMPERATURE_IMBALANCE_WARNING', null=True)),
                ('rack_under_temperature_warning', models.IntegerField(blank=True, db_column='RACK_UNDER_TEMPERATURE_WARNING', null=True)),
                ('rack_over_temperature_warning', models.IntegerField(blank=True, db_column='RACK_OVER_TEMPERATURE_WARNING', null=True)),
                ('rack_voltage_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_VOLTAGE_IMBALANCE_WARNING', null=True)),
                ('rack_under_voltage_protection_warning', models.IntegerField(blank=True, db_column='RACK_UNDER_VOLTAGE_PROTECTION_WARNING', null=True)),
                ('rack_over_voltage_protection_warning', models.IntegerField(blank=True, db_column='RACK_OVER_VOLTAGE_PROTECTION_WARNING', null=True)),
                ('rack_over_current_charge_warning', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_CHARGE_WARNING', null=True)),
                ('rack_over_current_discharge_warning', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_DISCHARGE_WARNING', null=True)),
                ('rack_temperature_imbalance_fault', models.IntegerField(blank=True, db_column='RACK_TEMPERATURE_IMBALANCE_FAULT', null=True)),
                ('rack_under_temperature_fault', models.IntegerField(blank=True, db_column='RACK_UNDER_TEMPERATURE_FAULT', null=True)),
                ('rack_over_temperature_fault', models.IntegerField(blank=True, db_column='RACK_OVER_TEMPERATURE_FAULT', null=True)),
                ('rack_voltage_imbalance_fault', models.IntegerField(blank=True, db_column='RACK_VOLTAGE_IMBALANCE_FAULT', null=True)),
                ('rack_under_voltage_protection_fault', models.IntegerField(blank=True, db_column='RACK_UNDER_VOLTAGE_PROTECTION_FAULT', null=True)),
                ('rack_over_voltage_protection_fault', models.IntegerField(blank=True, db_column='RACK_OVER_VOLTAGE_PROTECTION_FAULT', null=True)),
                ('rack_over_current_charge_fault', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_CHARGE_FAULT', null=True)),
                ('rack_over_current_discharge_fault', models.IntegerField(blank=True, db_column='RACK_OVER_CURRENT_DISCHARGE_FAULT', null=True)),
                ('rack_charge_relay_plus_fault_status', models.IntegerField(blank=True, db_column='RACK_CHARGE_RELAY_PLUS_FAULT_STATUS', null=True)),
                ('rack_discharge_relay_minus_fault_status', models.IntegerField(blank=True, db_column='RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS', null=True)),
                ('rack_fuse_minus_fault_status', models.IntegerField(blank=True, db_column='RACK_FUSE_MINUS_FAULT_STATUS', null=True)),
                ('rack_fuse_plus_fault_status', models.IntegerField(blank=True, db_column='RACK_FUSE_PLUS_FAULT_STATUS', null=True)),
                ('rack_tray_rack_communication_fault', models.IntegerField(blank=True, db_column='RACK_TRAY_RACK_COMMUNICATION_FAULT', null=True)),
                ('rack_max_module_temperature', models.FloatField(blank=True, db_column='RACK_MAX_MODULE_TEMPERATURE', null=True)),
                ('rack_max_module_temperature_position', models.FloatField(blank=True, db_column='RACK_MAX_MODULE_TEMPERATURE_POSITION', null=True)),
                ('rack_min_module_temperature', models.FloatField(blank=True, db_column='RACK_MIN_MODULE_TEMPERATURE', null=True)),
                ('rack_min_module_temperature_position', models.FloatField(blank=True, db_column='RACK_MIN_MODULE_TEMPERATURE_POSITION', null=True)),
                ('rack_max_module_humidity', models.FloatField(blank=True, db_column='RACK_MAX_MODULE_HUMIDITY', null=True)),
                ('rack_max_module_humidity_position', models.FloatField(blank=True, db_column='RACK_MAX_MODULE_HUMIDITY_POSITION', null=True)),
                ('rack_min_module_humidity', models.FloatField(blank=True, db_column='RACK_MIN_MODULE_HUMIDITY', null=True)),
                ('rack_min_module_humidity_position', models.FloatField(blank=True, db_column='RACK_MIN_MODULE_HUMIDITY_POSITION', null=True)),
                ('rack_status_for_online', models.IntegerField(blank=True, db_column='RACK_STATUS_FOR_Online', null=True)),
                ('rack_tray_volatge_imbalance_warning', models.IntegerField(blank=True, db_column='RACK_TRAY_VOLATGE_IMBALANCE_WARNING', null=True)),
                ('rack_module_fault', models.TextField(blank=True, db_column='RACK_MODULE_FAULT', null=True)),
            ],
            options={
                'db_table': 'rack',
                'abstract': False,
                'managed': False,
            },
        ),
        migrations.DeleteModel(
            name='SecondESSBank',
        ),
        migrations.DeleteModel(
            name='SecondESSEtc',
        ),
        migrations.DeleteModel(
            name='SecondESSPcs',
        ),
        migrations.DeleteModel(
            name='SecondESSRack',
        ),
    ]
