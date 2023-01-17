# Generated by Django 3.2.8 on 2023-01-16 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ess', '0004_auto_20220721_1402'),
    ]

    operations = [
        migrations.CreateModel(
            name='ESS3Bank',
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
            name='ESS3Etc',
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
            name='ESS3Pcs',
            fields=[
                ('timestamp', models.DateTimeField(db_column='TIMESTAMP', primary_key=True, serialize=False)),
                ('voltage', models.FloatField(blank=True, db_column='VOLTAGE', null=True)),
                ('current', models.FloatField(blank=True, db_column='CURRENT', null=True)),
                ('power', models.FloatField(blank=True, db_column='POWER', null=True)),
                ('ac_vu', models.FloatField(blank=True, db_column='AC_VU', null=True)),
                ('ac_vv', models.FloatField(blank=True, db_column='AC_VV', null=True)),
                ('ac_vw', models.FloatField(blank=True, db_column='AC_VW', null=True)),
                ('ac_iu', models.FloatField(blank=True, db_column='AC_IU', null=True)),
                ('ac_iv', models.FloatField(blank=True, db_column='AC_IV', null=True)),
                ('ac_iw', models.FloatField(blank=True, db_column='AC_IW', null=True)),
                ('ac_power', models.FloatField(blank=True, db_column='AC_POWER', null=True)),
                ('ac_freq', models.FloatField(blank=True, db_column='AC_FREQ', null=True)),
                ('dc_v', models.FloatField(blank=True, db_column='DC_V', null=True)),
                ('c_kwh', models.FloatField(blank=True, db_column='C_KWH', null=True)),
                ('power_setting', models.FloatField(blank=True, db_column='POWER_SETTING', null=True)),
                ('max_voltage', models.FloatField(blank=True, db_column='MAX_VOLTAGE', null=True)),
                ('min_voltage', models.FloatField(blank=True, db_column='MIN_VOLTAGE', null=True)),
                ('ci_setting', models.FloatField(blank=True, db_column='CI_SETTING', null=True)),
                ('di_setting', models.FloatField(blank=True, db_column='DI_SETTING', null=True)),
                ('lqe_ref', models.FloatField(blank=True, db_column='LQE_REF', null=True)),
                ('vdc_ref', models.FloatField(blank=True, db_column='VDC_REF', null=True)),
                ('d_kwh', models.FloatField(blank=True, db_column='D_KWH', null=True)),
                ('pf', models.FloatField(blank=True, db_column='PF', null=True)),
                ('state_of_pcs', models.IntegerField(blank=True, db_column='STATE_OF_PCS', null=True)),
                ('gate_err_a', models.IntegerField(blank=True, db_column='GATE_ERR_A', null=True)),
                ('gate_err_b', models.IntegerField(blank=True, db_column='GATE_ERR_B', null=True)),
                ('gate_err_c', models.IntegerField(blank=True, db_column='GATE_ERR_C', null=True)),
                ('e_stop_fault', models.IntegerField(blank=True, db_column='E_STOP_FAULT', null=True)),
                ('overheat', models.IntegerField(blank=True, db_column='OVERHEAT', null=True)),
                ('dc_fuse_fault', models.IntegerField(blank=True, db_column='DC_FUSE_FAULT', null=True)),
                ('init_fault', models.IntegerField(blank=True, db_column='INIT_FAULT', null=True)),
                ('ac_fuse_open', models.IntegerField(blank=True, db_column='AC_FUSE_OPEN', null=True)),
                ('imd_fault', models.IntegerField(blank=True, db_column='IMD_FAULT', null=True)),
                ('vbat_err', models.IntegerField(blank=True, db_column='VBAT_ERR', null=True)),
                ('oc_bat', models.IntegerField(blank=True, db_column='OC_BAT', null=True)),
                ('ov_vdc', models.IntegerField(blank=True, db_column='OV_VDC', null=True)),
                ('uv_vdc', models.IntegerField(blank=True, db_column='UV_VDC', null=True)),
                ('sft_unb_dc_link', models.IntegerField(blank=True, db_column='SFT_UNB_DC_LINK', null=True)),
                ('eeprom_write_error', models.IntegerField(blank=True, db_column='EEPROM_WRITE_ERROR', null=True)),
                ('ov_source', models.IntegerField(blank=True, db_column='OV_SOURCE', null=True)),
                ('uv_source', models.IntegerField(blank=True, db_column='UV_SOURCE', null=True)),
                ('seq_source', models.IntegerField(blank=True, db_column='SEQ_SOURCE', null=True)),
                ('unb_source', models.IntegerField(blank=True, db_column='UNB_SOURCE', null=True)),
                ('inter_source', models.IntegerField(blank=True, db_column='INTER_SOURCE', null=True)),
                ('oc_la_fault', models.IntegerField(blank=True, db_column='OC_LA_FAULT', null=True)),
                ('oc_lb_fault', models.IntegerField(blank=True, db_column='OC_LB_FAULT', null=True)),
                ('oc_lc_fault', models.IntegerField(blank=True, db_column='OC_LC_FAULT', null=True)),
                ('offset_la', models.IntegerField(blank=True, db_column='OFFSET_LA', null=True)),
                ('offset_lb', models.IntegerField(blank=True, db_column='OFFSET_LB', null=True)),
                ('unb_current', models.IntegerField(blank=True, db_column='UNB_CURRENT', null=True)),
                ('freq_low', models.IntegerField(blank=True, db_column='FREQ_LOW', null=True)),
                ('freq_high', models.IntegerField(blank=True, db_column='FREQ_HIGH', null=True)),
                ('pms_e_stop', models.IntegerField(blank=True, db_column='PMS_E_STOP', null=True)),
                ('overload', models.IntegerField(blank=True, db_column='OVERLOAD', null=True)),
                ('communication_error', models.IntegerField(blank=True, db_column='COMMUNICATION_ERROR', null=True)),
            ],
            options={
                'db_table': 'pcs',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ESS3Rack',
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
    ]
