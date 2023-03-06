from django.db import models

# Common ESS Object Info(But, excluding the Pcs because the Pcs columns are very different)


class CommonBankInfo(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    bank_soc = models.FloatField(db_column="BANK_SOC", blank=True, null=True)
    bank_soh = models.FloatField(db_column="BANK_SOH", blank=True, null=True)
    bank_dc_volt = models.FloatField(db_column="BANK_DC_VOLT", blank=True, null=True)
    bank_dc_current = models.FloatField(db_column="BANK_DC_CURRENT", blank=True, null=True)
    max_cell_voltage_of_bank = models.FloatField(db_column="MAX_CELL_VOLTAGE_OF_BANK", blank=True, null=True)
    min_cell_voltage_of_bank = models.FloatField(db_column="MIN_CELL_VOLTAGE_OF_BANK", blank=True, null=True)
    max_cell_temperature_of_bank = models.FloatField(db_column="MAX_CELL_TEMPERATURE_OF_BANK", blank=True, null=True)
    min_cell_temperature_of_bank = models.FloatField(db_column="MIN_CELL_TEMPERATURE_OF_BANK", blank=True, null=True)
    bank_power = models.FloatField(db_column="BANK_POWER", blank=True, null=True)
    rack_temperature_imbalance_warning = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_temperature_warning = models.IntegerField(
        db_column="RACK_UNDER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_over_temperature_warning = models.IntegerField(
        db_column="RACK_OVER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_voltage_protection_warning = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_voltage_protection_warning = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_current_charge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_WARNING", blank=True, null=True
    )
    rack_over_current_discharge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_WARNING", blank=True, null=True
    )
    rack_temperature_imbalance_fault = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_FAULT", blank=True, null=True
    )
    rack_under_temperature_fault = models.IntegerField(db_column="RACK_UNDER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_over_temperature_fault = models.IntegerField(db_column="RACK_OVER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_voltage_imbalance_fault = models.IntegerField(db_column="RACK_VOLTAGE_IMBALANCE_FAULT", blank=True, null=True)
    rack_under_voltage_protection_fault = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_voltage_protection_fault = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_current_charge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_FAULT", blank=True, null=True
    )
    rack_over_current_discharge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_FAULT", blank=True, null=True
    )
    rack_charge_relay_plus_fault_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_FAULT_STATUS", blank=True, null=True
    )
    rack_discharge_relay_minus_fault_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS", blank=True, null=True
    )
    rack_fuse_minus_fault_status = models.IntegerField(db_column="RACK_FUSE_MINUS_FAULT_STATUS", blank=True, null=True)
    rack_fuse_plus_fault_status = models.IntegerField(db_column="RACK_FUSE_PLUS_FAULT_STATUS", blank=True, null=True)
    rack_tray_rack_communication_fault = models.IntegerField(
        db_column="RACK_TRAY_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    battery_status_for_run = models.IntegerField(db_column="BATTERY_STATUS_FOR_RUN", blank=True, null=True)
    battery_status_for_charge = models.IntegerField(db_column="BATTERY_STATUS_FOR_CHARGE", blank=True, null=True)
    battery_status_for_fault = models.IntegerField(db_column="BATTERY_STATUS_FOR_FAULT", blank=True, null=True)
    battery_status_for_warning = models.IntegerField(db_column="BATTERY_STATUS_FOR_WARNING", blank=True, null=True)

    class Meta:
        abstract = True
        managed = False


class CommonRackInfo(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    rack_soc = models.FloatField(db_column="RACK_SOC", blank=True, null=True)
    rack_soh = models.FloatField(db_column="RACK_SOH", blank=True, null=True)
    rack_voltage = models.FloatField(db_column="RACK_VOLTAGE", blank=True, null=True)
    rack_current = models.FloatField(db_column="RACK_CURRENT", blank=True, null=True)
    rack_max_cell_voltage = models.FloatField(db_column="RACK_MAX_CELL_VOLTAGE", blank=True, null=True)
    rack_max_cell_voltage_position = models.FloatField(
        db_column="RACK_MAX_CELL_VOLTAGE_POSITION", blank=True, null=True
    )
    rack_min_cell_voltage = models.FloatField(db_column="RACK_MIN_CELL_VOLTAGE", blank=True, null=True)
    rack_min_cell_voltage_position = models.FloatField(
        db_column="RACK_MIN_CELL_VOLTAGE_POSITION", blank=True, null=True
    )
    rack_cell_voltage_gap = models.FloatField(db_column="RACK_CELL_VOLTAGE_GAP", blank=True, null=True)
    rack_cell_voltage_average = models.FloatField(db_column="RACK_CELL_VOLTAGE_AVERAGE", blank=True, null=True)
    rack_max_cell_temperature = models.FloatField(db_column="RACK_MAX_CELL_TEMPERATURE", blank=True, null=True)
    rack_max_cell_temperature_position = models.FloatField(
        db_column="RACK_MAX_CELL_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_min_cell_temperature = models.FloatField(db_column="RACK_MIN_CELL_TEMPERATURE", blank=True, null=True)
    rack_min_cell_temperature_position = models.FloatField(
        db_column="RACK_MIN_CELL_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_cell_temperature_gap = models.FloatField(db_column="RACK_CELL_TEMPERATURE_GAP", blank=True, null=True)
    rack_discharge_relay_minus_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_STATUS", blank=True, null=True
    )
    rack_charge_relay_plus_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_STATUS", blank=True, null=True
    )
    rack_cell_balance_status = models.IntegerField(db_column="RACK_CELL_BALANCE_STATUS", blank=True, null=True)
    rack_current_sensor_discharge = models.IntegerField(
        db_column="RACK_CURRENT_SENSOR_DISCHARGE", blank=True, null=True
    )
    rack_current_sensor_charge = models.IntegerField(db_column="RACK_CURRENT_SENSOR_CHARGE", blank=True, null=True)
    rack_status_for_run = models.IntegerField(db_column="RACK_STATUS_FOR_RUN", blank=True, null=True)
    rack_status_for_fault = models.IntegerField(db_column="RACK_STATUS_FOR_FAULT", blank=True, null=True)
    rack_status_for_warning = models.IntegerField(db_column="RACK_STATUS_FOR_WARNING", blank=True, null=True)
    rack_temperature_imbalance_warning = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_temperature_warning = models.IntegerField(
        db_column="RACK_UNDER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_over_temperature_warning = models.IntegerField(
        db_column="RACK_OVER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_voltage_protection_warning = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_voltage_protection_warning = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_current_charge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_WARNING", blank=True, null=True
    )
    rack_over_current_discharge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_WARNING", blank=True, null=True
    )
    rack_temperature_imbalance_fault = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_FAULT", blank=True, null=True
    )
    rack_under_temperature_fault = models.IntegerField(db_column="RACK_UNDER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_over_temperature_fault = models.IntegerField(db_column="RACK_OVER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_voltage_imbalance_fault = models.IntegerField(db_column="RACK_VOLTAGE_IMBALANCE_FAULT", blank=True, null=True)
    rack_under_voltage_protection_fault = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_voltage_protection_fault = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_current_charge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_FAULT", blank=True, null=True
    )
    rack_over_current_discharge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_FAULT", blank=True, null=True
    )
    rack_charge_relay_plus_fault_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_FAULT_STATUS", blank=True, null=True
    )
    rack_discharge_relay_minus_fault_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS", blank=True, null=True
    )
    rack_fuse_minus_fault_status = models.IntegerField(db_column="RACK_FUSE_MINUS_FAULT_STATUS", blank=True, null=True)
    rack_fuse_plus_fault_status = models.IntegerField(db_column="RACK_FUSE_PLUS_FAULT_STATUS", blank=True, null=True)
    rack_tray_rack_communication_fault = models.IntegerField(
        db_column="RACK_TRAY_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )

    class Meta:
        abstract = True
        managed = False


class CommonEtcInfo(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    sensor1_temperature = models.FloatField(db_column="SENSOR1_TEMPERATURE", blank=True, null=True)
    sensor1_humidity = models.FloatField(db_column="SENSOR1_HUMIDITY", blank=True, null=True)

    class Meta:
        abstract = True
        managed = False


# ESS Object Info


class Bank(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    bank_soc = models.FloatField(db_column="BANK_SOC", blank=True, null=True)
    bank_soh = models.FloatField(db_column="BANK_SOH", blank=True, null=True)
    bank_dc_volt = models.FloatField(db_column="BANK_DC_VOLT", blank=True, null=True)
    bank_dc_current = models.FloatField(db_column="BANK_DC_CURRENT", blank=True, null=True)
    max_cell_voltage_of_bank = models.FloatField(db_column="MAX_CELL_VOLTAGE_OF_BANK", blank=True, null=True)
    min_cell_voltage_of_bank = models.FloatField(db_column="MIN_CELL_VOLTAGE_OF_BANK", blank=True, null=True)
    max_cell_temperature_of_bank = models.FloatField(db_column="MAX_CELL_TEMPERATURE_OF_BANK", blank=True, null=True)
    min_cell_temperature_of_bank = models.FloatField(db_column="MIN_CELL_TEMPERATURE_OF_BANK", blank=True, null=True)
    bank_power = models.FloatField(db_column="BANK_POWER", blank=True, null=True)
    rack_temperature_imbalance_warning = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_temperature_warning = models.IntegerField(
        db_column="RACK_UNDER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_over_temperature_warning = models.IntegerField(
        db_column="RACK_OVER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_voltage_protection_warning = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_voltage_protection_warning = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_current_charge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_WARNING", blank=True, null=True
    )
    rack_over_current_discharge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_WARNING", blank=True, null=True
    )
    rack_temperature_imbalance_fault = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_FAULT", blank=True, null=True
    )
    rack_under_temperature_fault = models.IntegerField(db_column="RACK_UNDER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_over_temperature_fault = models.IntegerField(db_column="RACK_OVER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_voltage_imbalance_fault = models.IntegerField(db_column="RACK_VOLTAGE_IMBALANCE_FAULT", blank=True, null=True)
    rack_under_voltage_protection_fault = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_voltage_protection_fault = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_current_charge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_FAULT", blank=True, null=True
    )
    rack_over_current_discharge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_FAULT", blank=True, null=True
    )
    rack_charge_relay_plus_fault_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_FAULT_STATUS", blank=True, null=True
    )
    rack_discharge_relay_minus_fault_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS", blank=True, null=True
    )
    rack_fuse_minus_fault_status = models.IntegerField(db_column="RACK_FUSE_MINUS_FAULT_STATUS", blank=True, null=True)
    rack_fuse_plus_fault_status = models.IntegerField(db_column="RACK_FUSE_PLUS_FAULT_STATUS", blank=True, null=True)
    rack_tray_rack_communication_fault = models.IntegerField(
        db_column="RACK_TRAY_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n001_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N001_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n002_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N002_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n003_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N003_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n004_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N004_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n005_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N005_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n006_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N006_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n007_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N007_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    rack_n008_master_rack_communication_fault = models.IntegerField(
        db_column="RACK_N008_MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )
    battery_status_for_run = models.IntegerField(db_column="BATTERY_STATUS_FOR_RUN", blank=True, null=True)
    battery_status_for_charge = models.IntegerField(db_column="BATTERY_STATUS_FOR_CHARGE", blank=True, null=True)
    battery_status_for_fault = models.IntegerField(db_column="BATTERY_STATUS_FOR_FAULT", blank=True, null=True)
    battery_status_for_warning = models.IntegerField(db_column="BATTERY_STATUS_FOR_WARNING", blank=True, null=True)
    master_rack_communication_fault = models.IntegerField(
        db_column="MASTER_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )

    class Meta:
        managed = False
        db_table = "bank"


class ESS2Bank(CommonBankInfo):
    max_module_temperature = models.FloatField(db_column="MAX_MODULE_TEMPERATURE", blank=True, null=True)
    min_module_temperature = models.FloatField(db_column="MIN_MODULE_TEMPERATURE", blank=True, null=True)
    max_module_humidity = models.FloatField(db_column="MAX_MODULE_HUMIDITY", blank=True, null=True)
    min_module_humidity = models.FloatField(db_column="MIN_MODULE_HUMIDITY", blank=True, null=True)
    rack_tray_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_TRAY_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    master_rack_communication_fault = models.TextField(
        db_column="MASTER_RACK_COMMUNICATION_FAULT", blank=True, default=""
    )
    battery_status_for_standby = models.IntegerField(db_column="BATTERY_STATUS_FOR_STANDBY", blank=True, null=True)
    battery_status_for_discharge = models.IntegerField(db_column="BATTERY_STATUS_FOR_DISCHARGE", blank=True, null=True)
    rack_to_master_bms_communication_status = models.IntegerField(
        db_column="RACK_TO_MASTER_BMS_COMMUNICATION_STATUS", blank=True, null=True
    )
    charging_stop_of_status = models.IntegerField(db_column="CHARGING_STOP_OF_STATUS", blank=True, null=True)
    discharging_stop_of_status = models.IntegerField(db_column="DISCHARGING_STOP_OF_STATUS", blank=True, null=True)
    emergency_status = models.IntegerField(db_column="EMERGENCY_STATUS", blank=True, null=True)
    tvoc_status = models.IntegerField(db_column="TVOC_STATUS", blank=True, null=True)
    order_source = models.IntegerField(db_column="ORDER_SOURCE", blank=True, null=True)
    emergency_source = models.IntegerField(db_column="EMERGENCY_SOURCE", blank=True, null=True)

    class Meta(CommonBankInfo.Meta):
        db_table = "bank"


class ESS3Bank(CommonBankInfo):
    max_module_temperature = models.FloatField(db_column="MAX_MODULE_TEMPERATURE", blank=True, null=True)
    min_module_temperature = models.FloatField(db_column="MIN_MODULE_TEMPERATURE", blank=True, null=True)
    max_module_humidity = models.FloatField(db_column="MAX_MODULE_HUMIDITY", blank=True, null=True)
    min_module_humidity = models.FloatField(db_column="MIN_MODULE_HUMIDITY", blank=True, null=True)
    rack_tray_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_TRAY_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    master_rack_communication_fault = models.TextField(
        db_column="MASTER_RACK_COMMUNICATION_FAULT", blank=True, default=""
    )
    battery_status_for_standby = models.IntegerField(db_column="BATTERY_STATUS_FOR_STANDBY", blank=True, null=True)
    battery_status_for_discharge = models.IntegerField(db_column="BATTERY_STATUS_FOR_DISCHARGE", blank=True, null=True)
    rack_to_master_bms_communication_status = models.IntegerField(
        db_column="RACK_TO_MASTER_BMS_COMMUNICATION_STATUS", blank=True, null=True
    )
    charging_stop_of_status = models.IntegerField(db_column="CHARGING_STOP_OF_STATUS", blank=True, null=True)
    discharging_stop_of_status = models.IntegerField(db_column="DISCHARGING_STOP_OF_STATUS", blank=True, null=True)
    emergency_status = models.IntegerField(db_column="EMERGENCY_STATUS", blank=True, null=True)
    tvoc_status = models.IntegerField(db_column="TVOC_STATUS", blank=True, null=True)
    order_source = models.IntegerField(db_column="ORDER_SOURCE", blank=True, null=True)
    emergency_source = models.IntegerField(db_column="EMERGENCY_SOURCE", blank=True, null=True)

    class Meta(CommonBankInfo.Meta):
        db_table = "bank"


class Rack(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    rack_soc = models.FloatField(db_column="RACK_SOC", blank=True, null=True)
    rack_soh = models.FloatField(db_column="RACK_SOH", blank=True, null=True)
    rack_voltage = models.FloatField(db_column="RACK_VOLTAGE", blank=True, null=True)
    rack_current = models.FloatField(db_column="RACK_CURRENT", blank=True, null=True)
    rack_max_cell_voltage = models.FloatField(db_column="RACK_MAX_CELL_VOLTAGE", blank=True, null=True)
    rack_max_cell_voltage_position = models.FloatField(
        db_column="RACK_MAX_CELL_VOLTAGE_POSITION", blank=True, null=True
    )
    rack_min_cell_voltage = models.FloatField(db_column="RACK_MIN_CELL_VOLTAGE", blank=True, null=True)
    rack_min_cell_voltage_position = models.FloatField(
        db_column="RACK_MIN_CELL_VOLTAGE_POSITION", blank=True, null=True
    )
    rack_cell_voltage_gap = models.FloatField(db_column="RACK_CELL_VOLTAGE_GAP", blank=True, null=True)
    rack_cell_voltage_average = models.FloatField(db_column="RACK_CELL_VOLTAGE_AVERAGE", blank=True, null=True)
    rack_max_cell_temperature = models.FloatField(db_column="RACK_MAX_CELL_TEMPERATURE", blank=True, null=True)
    rack_max_cell_temperature_position = models.FloatField(
        db_column="RACK_MAX_CELL_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_min_cell_temperature = models.FloatField(db_column="RACK_MIN_CELL_TEMPERATURE", blank=True, null=True)
    rack_min_cell_temperature_position = models.FloatField(
        db_column="RACK_MIN_CELL_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_cell_temperature_gap = models.FloatField(db_column="RACK_CELL_TEMPERATURE_GAP", blank=True, null=True)
    rack_cell_temperature_average = models.FloatField(db_column="RACK_CELL_TEMPERATURE_AVERAGE", blank=True, null=True)
    rack_discharge_relay_minus_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_STATUS", blank=True, null=True
    )
    rack_charge_relay_plus_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_STATUS", blank=True, null=True
    )
    rack_cell_balance_status = models.IntegerField(db_column="RACK_CELL_BALANCE_STATUS", blank=True, null=True)
    rack_current_sensor_discharge = models.IntegerField(
        db_column="RACK_CURRENT_SENSOR_DISCHARGE", blank=True, null=True
    )
    rack_current_sensor_charge = models.IntegerField(db_column="RACK_CURRENT_SENSOR_CHARGE", blank=True, null=True)
    rack_status_for_run = models.IntegerField(db_column="RACK_STATUS_FOR_RUN", blank=True, null=True)
    rack_status_for_fault = models.IntegerField(db_column="RACK_STATUS_FOR_FAULT", blank=True, null=True)
    rack_status_for_warning = models.IntegerField(db_column="RACK_STATUS_FOR_WARNING", blank=True, null=True)
    rack_temperature_imbalance_warning = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_temperature_warning = models.IntegerField(
        db_column="RACK_UNDER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_over_temperature_warning = models.IntegerField(
        db_column="RACK_OVER_TEMPERATURE_WARNING", blank=True, null=True
    )
    rack_voltage_imbalance_warning = models.IntegerField(
        db_column="RACK_VOLTAGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_under_voltage_protection_warning = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_voltage_protection_warning = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_WARNING", blank=True, null=True
    )
    rack_over_current_charge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_WARNING", blank=True, null=True
    )
    rack_over_current_discharge_warning = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_WARNING", blank=True, null=True
    )
    rack_temperature_imbalance_fault = models.IntegerField(
        db_column="RACK_TEMPERATURE_IMBALANCE_FAULT", blank=True, null=True
    )
    rack_under_temperature_fault = models.IntegerField(db_column="RACK_UNDER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_over_temperature_fault = models.IntegerField(db_column="RACK_OVER_TEMPERATURE_FAULT", blank=True, null=True)
    rack_voltage_imbalance_fault = models.IntegerField(db_column="RACK_VOLTAGE_IMBALANCE_FAULT", blank=True, null=True)
    rack_under_voltage_protection_fault = models.IntegerField(
        db_column="RACK_UNDER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_voltage_protection_fault = models.IntegerField(
        db_column="RACK_OVER_VOLTAGE_PROTECTION_FAULT", blank=True, null=True
    )
    rack_over_current_charge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_CHARGE_FAULT", blank=True, null=True
    )
    rack_over_current_discharge_fault = models.IntegerField(
        db_column="RACK_OVER_CURRENT_DISCHARGE_FAULT", blank=True, null=True
    )
    rack_charge_relay_plus_fault_status = models.IntegerField(
        db_column="RACK_CHARGE_RELAY_PLUS_FAULT_STATUS", blank=True, null=True
    )
    rack_discharge_relay_minus_fault_status = models.IntegerField(
        db_column="RACK_DISCHARGE_RELAY_MINUS_FAULT_STATUS", blank=True, null=True
    )
    rack_fuse_minus_fault_status = models.IntegerField(db_column="RACK_FUSE_MINUS_FAULT_STATUS", blank=True, null=True)
    rack_fuse_plus_fault_status = models.IntegerField(db_column="RACK_FUSE_PLUS_FAULT_STATUS", blank=True, null=True)
    rack_tray_rack_communication_fault = models.IntegerField(
        db_column="RACK_TRAY_RACK_COMMUNICATION_FAULT", blank=True, null=True
    )

    class Meta:
        managed = False
        db_table = "rack"


class ESS2Rack(CommonRackInfo):
    rack_max_module_temperature = models.FloatField(db_column="RACK_MAX_MODULE_TEMPERATURE", blank=True, null=True)
    rack_max_module_temperature_position = models.FloatField(
        db_column="RACK_MAX_MODULE_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_min_module_temperature = models.FloatField(db_column="RACK_MIN_MODULE_TEMPERATURE", blank=True, null=True)
    rack_min_module_temperature_position = models.FloatField(
        db_column="RACK_MIN_MODULE_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_max_module_humidity = models.FloatField(db_column="RACK_MAX_MODULE_HUMIDITY", blank=True, null=True)
    rack_max_module_humidity_position = models.FloatField(
        db_column="RACK_MAX_MODULE_HUMIDITY_POSITION", blank=True, null=True
    )
    rack_min_module_humidity = models.FloatField(db_column="RACK_MIN_MODULE_HUMIDITY", blank=True, null=True)
    rack_min_module_humidity_position = models.FloatField(
        db_column="RACK_MIN_MODULE_HUMIDITY_POSITION", blank=True, null=True
    )
    rack_status_for_online = models.IntegerField(db_column="RACK_STATUS_FOR_Online", blank=True, null=True)
    rack_tray_volatge_imbalance_warning = models.IntegerField(
        db_column="RACK_TRAY_VOLATGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_module_fault = models.TextField(db_column="RACK_MODULE_FAULT", blank=True, null=True)

    class Meta(CommonRackInfo.Meta):
        db_table = "rack"


class ESS3Rack(CommonRackInfo):
    rack_max_module_temperature = models.FloatField(db_column="RACK_MAX_MODULE_TEMPERATURE", blank=True, null=True)
    rack_max_module_temperature_position = models.FloatField(
        db_column="RACK_MAX_MODULE_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_min_module_temperature = models.FloatField(db_column="RACK_MIN_MODULE_TEMPERATURE", blank=True, null=True)
    rack_min_module_temperature_position = models.FloatField(
        db_column="RACK_MIN_MODULE_TEMPERATURE_POSITION", blank=True, null=True
    )
    rack_max_module_humidity = models.FloatField(db_column="RACK_MAX_MODULE_HUMIDITY", blank=True, null=True)
    rack_max_module_humidity_position = models.FloatField(
        db_column="RACK_MAX_MODULE_HUMIDITY_POSITION", blank=True, null=True
    )
    rack_min_module_humidity = models.FloatField(db_column="RACK_MIN_MODULE_HUMIDITY", blank=True, null=True)
    rack_min_module_humidity_position = models.FloatField(
        db_column="RACK_MIN_MODULE_HUMIDITY_POSITION", blank=True, null=True
    )
    rack_status_for_online = models.IntegerField(db_column="RACK_STATUS_FOR_Online", blank=True, null=True)
    rack_tray_volatge_imbalance_warning = models.IntegerField(
        db_column="RACK_TRAY_VOLATGE_IMBALANCE_WARNING", blank=True, null=True
    )
    rack_module_fault = models.TextField(db_column="RACK_MODULE_FAULT", blank=True, null=True)

    class Meta(CommonRackInfo.Meta):
        db_table = "rack"


class Pcs(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    pcs_ac_l1_thd = models.FloatField(db_column="PCS_AC_L1_THD", blank=True, null=True)
    pcs_ac_l2_thd = models.FloatField(db_column="PCS_AC_L2_THD", blank=True, null=True)
    pcs_ac_l3_thd = models.FloatField(db_column="PCS_AC_L3_THD", blank=True, null=True)
    system_temperature_max = models.FloatField(db_column="SYSTEM_TEMPERATURE_MAX", blank=True, null=True)
    dc_voltage_1 = models.FloatField(db_column="DC_VOLTAGE_1", blank=True, null=True)
    dc_voltage_2 = models.FloatField(db_column="DC_VOLTAGE_2", blank=True, null=True)
    dc_current = models.FloatField(db_column="DC_CURRENT", blank=True, null=True)
    dc_power = models.FloatField(db_column="DC_POWER", blank=True, null=True)
    ac_frequency = models.FloatField(db_column="AC_FREQUENCY", blank=True, null=True)
    ac_voltage = models.FloatField(db_column="AC_VOLTAGE", blank=True, null=True)
    ac_current_low = models.FloatField(db_column="AC_CURRENT_LOW", blank=True, null=True)
    ac_current_high = models.FloatField(db_column="AC_CURRENT_HIGH", blank=True, null=True)
    ac_power = models.FloatField(db_column="AC_POWER", blank=True, null=True)
    ac_active_power = models.FloatField(db_column="AC_ACTIVE_POWER", blank=True, null=True)
    ac_reactive_power = models.FloatField(db_column="AC_REACTIVE_POWER", blank=True, null=True)
    ac_power_factor = models.FloatField(db_column="AC_POWER_FACTOR", blank=True, null=True)
    ac_l1_voltage = models.FloatField(db_column="AC_L1_VOLTAGE", blank=True, null=True)
    ac_l1_current = models.FloatField(db_column="AC_L1_CURRENT", blank=True, null=True)
    ac_l2_voltage = models.FloatField(db_column="AC_L2_VOLTAGE", blank=True, null=True)
    ac_l2_current = models.FloatField(db_column="AC_L2_CURRENT", blank=True, null=True)
    ac_l3_voltage = models.FloatField(db_column="AC_L3_VOLTAGE", blank=True, null=True)
    ac_l3_current = models.FloatField(db_column="AC_L3_CURRENT", blank=True, null=True)
    ac_accumulated_discharge_energy_low = models.FloatField(
        db_column="AC_ACCUMULATED_DISCHARGE_ENERGY_LOW", blank=True, null=True
    )
    ac_accumulated_discharge_energy_high = models.FloatField(
        db_column="AC_ACCUMULATED_DISCHARGE_ENERGY_HIGH", blank=True, null=True
    )
    ac_accumulated_charge_energy_low = models.FloatField(
        db_column="AC_ACCUMULATED_CHARGE_ENERGY_LOW", blank=True, null=True
    )
    ac_accumulated_charge_energy_high = models.FloatField(
        db_column="AC_ACCUMULATED_CHARGE_ENERGY_HIGH", blank=True, null=True
    )
    pcs_status_0 = models.FloatField(db_column="PCS_STATUS_0", blank=True, null=True)
    pcs_status_1 = models.FloatField(db_column="PCS_STATUS_1", blank=True, null=True)
    pcs_status_2 = models.FloatField(db_column="PCS_STATUS_2", blank=True, null=True)
    pcs_status_3 = models.FloatField(db_column="PCS_STATUS_3", blank=True, null=True)
    pcs_status_4 = models.FloatField(db_column="PCS_STATUS_4", blank=True, null=True)
    pcs_status_5 = models.FloatField(db_column="PCS_STATUS_5", blank=True, null=True)
    pcs_status_6 = models.FloatField(db_column="PCS_STATUS_6", blank=True, null=True)
    pcs_status_7 = models.FloatField(db_column="PCS_STATUS_7", blank=True, null=True)
    pcs_status_8 = models.FloatField(db_column="PCS_STATUS_8", blank=True, null=True)
    pcs_status_9 = models.FloatField(db_column="PCS_STATUS_9", blank=True, null=True)
    pcs_status_10 = models.FloatField(db_column="PCS_STATUS_10", blank=True, null=True)
    pcs_status_11 = models.FloatField(db_column="PCS_STATUS_11", blank=True, null=True)
    pcs_status_14 = models.FloatField(db_column="PCS_STATUS_14", blank=True, null=True)
    pcs_status_15 = models.FloatField(db_column="PCS_STATUS_15", blank=True, null=True)
    pcs_protection_1_0 = models.FloatField(db_column="PCS_PROTECTION_1_0", blank=True, null=True)
    pcs_protection_1_1 = models.FloatField(db_column="PCS_PROTECTION_1_1", blank=True, null=True)
    pcs_protection_1_2 = models.FloatField(db_column="PCS_PROTECTION_1_2", blank=True, null=True)
    pcs_protection_1_3 = models.FloatField(db_column="PCS_PROTECTION_1_3", blank=True, null=True)
    pcs_protection_1_4 = models.FloatField(db_column="PCS_PROTECTION_1_4", blank=True, null=True)
    pcs_protection_1_5 = models.FloatField(db_column="PCS_PROTECTION_1_5", blank=True, null=True)
    pcs_protection_1_6 = models.FloatField(db_column="PCS_PROTECTION_1_6", blank=True, null=True)
    pcs_protection_1_7 = models.FloatField(db_column="PCS_PROTECTION_1_7", blank=True, null=True)
    pcs_protection_1_8 = models.FloatField(db_column="PCS_PROTECTION_1_8", blank=True, null=True)
    pcs_protection_1_9 = models.FloatField(db_column="PCS_PROTECTION_1_9", blank=True, null=True)
    pcs_protection_1_10 = models.FloatField(db_column="PCS_PROTECTION_1_10", blank=True, null=True)
    pcs_protection_1_11 = models.FloatField(db_column="PCS_PROTECTION_1_11", blank=True, null=True)
    pcs_protection_1_12 = models.FloatField(db_column="PCS_PROTECTION_1_12", blank=True, null=True)
    pcs_protection_1_13 = models.FloatField(db_column="PCS_PROTECTION_1_13", blank=True, null=True)
    pcs_protection_1_14 = models.FloatField(db_column="PCS_PROTECTION_1_14", blank=True, null=True)
    pcs_protection_1_15 = models.FloatField(db_column="PCS_PROTECTION_1_15", blank=True, null=True)
    pcs_protection_2_0 = models.FloatField(db_column="PCS_PROTECTION_2_0", blank=True, null=True)
    pcs_protection_2_1 = models.FloatField(db_column="PCS_PROTECTION_2_1", blank=True, null=True)
    pcs_protection_2_2 = models.FloatField(db_column="PCS_PROTECTION_2_2", blank=True, null=True)
    pcs_protection_2_3 = models.FloatField(db_column="PCS_PROTECTION_2_3", blank=True, null=True)
    pcs_protection_2_4 = models.FloatField(db_column="PCS_PROTECTION_2_4", blank=True, null=True)
    pcs_protection_2_5 = models.FloatField(db_column="PCS_PROTECTION_2_5", blank=True, null=True)
    pcs_protection_2_6 = models.FloatField(db_column="PCS_PROTECTION_2_6", blank=True, null=True)
    pcs_protection_2_7 = models.FloatField(db_column="PCS_PROTECTION_2_7", blank=True, null=True)
    pcs_protection_2_8 = models.FloatField(db_column="PCS_PROTECTION_2_8", blank=True, null=True)
    pcs_protection_2_9 = models.FloatField(db_column="PCS_PROTECTION_2_9", blank=True, null=True)
    pcs_protection_2_10 = models.FloatField(db_column="PCS_PROTECTION_2_10", blank=True, null=True)
    pcs_protection_2_11 = models.FloatField(db_column="PCS_PROTECTION_2_11", blank=True, null=True)
    pcs_protection_2_12 = models.FloatField(db_column="PCS_PROTECTION_2_12", blank=True, null=True)
    pcs_protection_2_13 = models.FloatField(db_column="PCS_PROTECTION_2_13", blank=True, null=True)
    pcs_protection_2_14 = models.FloatField(db_column="PCS_PROTECTION_2_14", blank=True, null=True)
    pcs_protection_2_15 = models.FloatField(db_column="PCS_PROTECTION_2_15", blank=True, null=True)
    pcs_protection_3_0 = models.FloatField(db_column="PCS_PROTECTION_3_0", blank=True, null=True)
    pcs_protection_3_1 = models.FloatField(db_column="PCS_PROTECTION_3_1", blank=True, null=True)
    pcs_protection_3_2 = models.FloatField(db_column="PCS_PROTECTION_3_2", blank=True, null=True)
    pcs_protection_3_3 = models.FloatField(db_column="PCS_PROTECTION_3_3", blank=True, null=True)
    pcs_protection_3_4 = models.FloatField(db_column="PCS_PROTECTION_3_4", blank=True, null=True)
    pcs_protection_3_5 = models.FloatField(db_column="PCS_PROTECTION_3_5", blank=True, null=True)
    pcs_protection_3_6 = models.FloatField(db_column="PCS_PROTECTION_3_6", blank=True, null=True)
    pcs_protection_3_7 = models.FloatField(db_column="PCS_PROTECTION_3_7", blank=True, null=True)
    pcs_protection_3_8 = models.FloatField(db_column="PCS_PROTECTION_3_8", blank=True, null=True)
    pcs_protection_3_9 = models.FloatField(db_column="PCS_PROTECTION_3_9", blank=True, null=True)
    pcs_protection_3_10 = models.FloatField(db_column="PCS_PROTECTION_3_10", blank=True, null=True)
    pcs_control_0 = models.FloatField(db_column="PCS_CONTROL_0", blank=True, null=True)
    set_power = models.FloatField(db_column="SET_POWER", blank=True, null=True)
    set_soc_low_trip_level = models.FloatField(db_column="SET_SOC_LOW_TRIP_LEVEL", blank=True, null=True)
    set_soc_high_trip_level = models.FloatField(db_column="SET_SOC_HIGH_TRIP_LEVEL", blank=True, null=True)
    set_vbat_low_trip_level = models.FloatField(db_column="SET_VBAT_LOW_TRIP_LEVEL", blank=True, null=True)
    set_vbat_high_trip_level = models.FloatField(db_column="SET_VBAT_HIGH_TRIP_LEVEL", blank=True, null=True)

    class Meta:
        managed = False
        db_table = "pcs"


class ESS2Pcs(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    ai_vdc = models.FloatField(db_column="AI_VDC", blank=True, null=True)
    ai_idc = models.FloatField(db_column="AI_IDC", blank=True, null=True)
    ai_pdc = models.FloatField(db_column="AI_PDC", blank=True, null=True)
    ai_freq = models.FloatField(db_column="AI_FREQ", blank=True, null=True)
    ai_vab_rms = models.FloatField(db_column="AI_VAB_RMS", blank=True, null=True)
    ai_vbc_rms = models.FloatField(db_column="AI_VBC_RMS", blank=True, null=True)
    ai_vca_rms = models.FloatField(db_column="AI_VCA_RMS", blank=True, null=True)
    ai_ias_rms = models.FloatField(db_column="AI_IAS_RMS", blank=True, null=True)
    ai_ibs_rms = models.FloatField(db_column="AI_IBS_RMS", blank=True, null=True)
    ai_ics_rms = models.FloatField(db_column="AI_ICS_RMS", blank=True, null=True)
    ai_sac = models.FloatField(db_column="AI_SAC", blank=True, null=True)
    ai_pac = models.FloatField(db_column="AI_PAC", blank=True, null=True)
    ai_qac = models.FloatField(db_column="AI_QAC", blank=True, null=True)
    ai_pf = models.FloatField(db_column="AI_PF", blank=True, null=True)
    ai_c_kwh_ach = models.FloatField(db_column="AI_C_KWH_ACH", blank=True, null=True)
    ai_c_kwh_acl = models.FloatField(db_column="AI_C_KWH_ACL", blank=True, null=True)
    ai_d_kwh_ach = models.FloatField(db_column="AI_D_KWH_ACH", blank=True, null=True)
    ai_d_kwh_acl = models.FloatField(db_column="AI_D_KWH_ACL", blank=True, null=True)
    ai_c_kwh_dch = models.FloatField(db_column="AI_C_KWH_DCH", blank=True, null=True)
    ai_c_kwh_dcl = models.FloatField(db_column="AI_C_KWH_DCL", blank=True, null=True)
    ai_d_kwh_dch = models.FloatField(db_column="AI_D_KWH_DCH", blank=True, null=True)
    ai_d_kwh_dcl = models.FloatField(db_column="AI_D_KWH_DCL", blank=True, null=True)
    cmd_kw = models.FloatField(db_column="CMD_KW", blank=True, null=True)
    cmd_kvar = models.FloatField(db_column="CMD_KVAR", blank=True, null=True)
    cmd_vdc_ref = models.FloatField(db_column="CMD_VDC_REF", blank=True, null=True)
    st_run = models.FloatField(db_column="ST_RUN", blank=True, null=True)
    st_stop = models.FloatField(db_column="ST_STOP", blank=True, null=True)
    st_ready = models.FloatField(db_column="ST_READY", blank=True, null=True)
    st_mode_l_r = models.FloatField(db_column="ST_MODE_L_R", blank=True, null=True)
    st_mode_cv = models.FloatField(db_column="ST_MODE_CV", blank=True, null=True)
    st_fault = models.FloatField(db_column="ST_FAULT", blank=True, null=True)
    st_charge = models.FloatField(db_column="ST_CHARGE", blank=True, null=True)
    st_discharge = models.FloatField(db_column="ST_DISCHARGE", blank=True, null=True)
    di_dk = models.FloatField(db_column="DI_DK", blank=True, null=True)
    di_ak = models.FloatField(db_column="DI_AK", blank=True, null=True)
    di_ck = models.FloatField(db_column="DI_CK", blank=True, null=True)
    di_temp = models.FloatField(db_column="DI_TEMP", blank=True, null=True)
    di_spd = models.FloatField(db_column="DI_SPD", blank=True, null=True)
    di_ds = models.FloatField(db_column="DI_DS", blank=True, null=True)
    di_start = models.FloatField(db_column="DI_START", blank=True, null=True)
    di_es = models.FloatField(db_column="DI_ES", blank=True, null=True)
    flt_ovar = models.FloatField(db_column="FLT_OVAR", blank=True, null=True)
    flt_uvar = models.FloatField(db_column="FLT_UVAR", blank=True, null=True)
    flt_ofr = models.FloatField(db_column="FLT_OFR", blank=True, null=True)
    flt_ufr = models.FloatField(db_column="FLT_UFR", blank=True, null=True)
    flt_ocar = models.FloatField(db_column="FLT_OCAR", blank=True, null=True)
    flt_ovdr = models.FloatField(db_column="FLT_OVDR", blank=True, null=True)
    flt_uvdr = models.FloatField(db_column="FLT_UVDR", blank=True, null=True)
    flt_ocdr = models.FloatField(db_column="FLT_OCDR", blank=True, null=True)
    flt_cfd = models.FloatField(db_column="FLT_CFD", blank=True, null=True)
    flt_otr = models.FloatField(db_column="FLT_OTR", blank=True, null=True)
    flt_spd = models.FloatField(db_column="FLT_SPD", blank=True, null=True)
    flt_rvet = models.FloatField(db_column="FLT_RVET", blank=True, null=True)

    class Meta:
        managed = False
        db_table = "pcs"


class ESS3Pcs(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    voltage = models.FloatField(db_column="VOLTAGE", blank=True, null=True)
    current = models.FloatField(db_column="CURRENT", blank=True, null=True)
    power = models.FloatField(db_column="POWER", blank=True, null=True)
    ac_vu = models.FloatField(db_column="AC_VU", blank=True, null=True)
    ac_vv = models.FloatField(db_column="AC_VV", blank=True, null=True)
    ac_vw = models.FloatField(db_column="AC_VW", blank=True, null=True)
    ac_iu = models.FloatField(db_column="AC_IU", blank=True, null=True)
    ac_iv = models.FloatField(db_column="AC_IV", blank=True, null=True)
    ac_iw = models.FloatField(db_column="AC_IW", blank=True, null=True)
    ac_power = models.FloatField(db_column="AC_POWER", blank=True, null=True)
    ac_freq = models.FloatField(db_column="AC_FREQ", blank=True, null=True)
    dc_v = models.FloatField(db_column="DC_V", blank=True, null=True)
    c_kwh = models.FloatField(db_column="C_KWH", blank=True, null=True)
    power_setting = models.FloatField(db_column="POWER_SETTING", blank=True, null=True)
    max_voltage = models.FloatField(db_column="MAX_VOLTAGE", blank=True, null=True)
    min_voltage = models.FloatField(db_column="MIN_VOLTAGE", blank=True, null=True)
    ci_setting = models.FloatField(db_column="CI_SETTING", blank=True, null=True)
    di_setting = models.FloatField(db_column="DI_SETTING", blank=True, null=True)
    lqe_ref = models.FloatField(db_column="LQE_REF", blank=True, null=True)
    vdc_ref = models.FloatField(db_column="VDC_REF", blank=True, null=True)
    d_kwh = models.FloatField(db_column="D_KWH", blank=True, null=True)
    pf = models.FloatField(db_column="PF", blank=True, null=True)
    state_of_pcs = models.IntegerField(db_column="STATE_OF_PCS", blank=True, null=True)
    gate_err_a = models.IntegerField(db_column="GATE_ERR_A", blank=True, null=True)
    gate_err_b = models.IntegerField(db_column="GATE_ERR_B", blank=True, null=True)
    gate_err_c = models.IntegerField(db_column="GATE_ERR_C", blank=True, null=True)
    e_stop_fault = models.IntegerField(db_column="E_STOP_FAULT", blank=True, null=True)
    overheat = models.IntegerField(db_column="OVERHEAT", blank=True, null=True)
    dc_fuse_fault = models.IntegerField(db_column="DC_FUSE_FAULT", blank=True, null=True)
    init_fault = models.IntegerField(db_column="INIT_FAULT", blank=True, null=True)
    ac_fuse_open = models.IntegerField(db_column="AC_FUSE_OPEN", blank=True, null=True)
    imd_fault = models.IntegerField(db_column="IMD_FAULT", blank=True, null=True)
    vbat_err = models.IntegerField(db_column="VBAT_ERR", blank=True, null=True)
    oc_bat = models.IntegerField(db_column="OC_BAT", blank=True, null=True)
    ov_vdc = models.IntegerField(db_column="OV_VDC", blank=True, null=True)
    uv_vdc = models.IntegerField(db_column="UV_VDC", blank=True, null=True)
    sft_unb_dc_link = models.IntegerField(db_column="SFT_UNB_DC_LINK", blank=True, null=True)
    eeprom_write_error = models.IntegerField(db_column="EEPROM_WRITE_ERROR", blank=True, null=True)
    ov_source = models.IntegerField(db_column="OV_SOURCE", blank=True, null=True)
    uv_source = models.IntegerField(db_column="UV_SOURCE", blank=True, null=True)
    seq_source = models.IntegerField(db_column="SEQ_SOURCE", blank=True, null=True)
    unb_source = models.IntegerField(db_column="UNB_SOURCE", blank=True, null=True)
    inter_source = models.IntegerField(db_column="INTER_SOURCE", blank=True, null=True)
    oc_la_fault = models.IntegerField(db_column="OC_LA_FAULT", blank=True, null=True)
    oc_lb_fault = models.IntegerField(db_column="OC_LB_FAULT", blank=True, null=True)
    oc_lc_fault = models.IntegerField(db_column="OC_LC_FAULT", blank=True, null=True)
    offset_la = models.IntegerField(db_column="OFFSET_LA", blank=True, null=True)
    offset_lb = models.IntegerField(db_column="OFFSET_LB", blank=True, null=True)
    unb_current = models.IntegerField(db_column="UNB_CURRENT", blank=True, null=True)
    freq_low = models.IntegerField(db_column="FREQ_LOW", blank=True, null=True)
    freq_high = models.IntegerField(db_column="FREQ_HIGH", blank=True, null=True)
    pms_e_stop = models.IntegerField(db_column="PMS_E_STOP", blank=True, null=True)
    overload = models.IntegerField(db_column="OVERLOAD", blank=True, null=True)
    communication_error = models.IntegerField(db_column="COMMUNICATION_ERROR", blank=True, null=True)

    class Meta:
        managed = False
        db_table = "pcs"


class Etc(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    sensor1_temperature = models.FloatField(db_column="SENSOR1_TEMPERATURE", blank=True, null=True)
    sensor1_humidity = models.FloatField(db_column="SENSOR1_HUMIDITY", blank=True, null=True)
    inv1_active_power = models.FloatField(db_column="INV1_ACTIVE_POWER", blank=True, null=True)
    inv1_cumluative_power_generation = models.FloatField(
        db_column="INV1_CUMLUATIVE_POWER_GENERATION", blank=True, null=True
    )

    class Meta:
        managed = False
        db_table = "etc"


class ESS2Etc(CommonEtcInfo):
    sensor2_temperature = models.FloatField(db_column="SENSOR2_TEMPERATURE", blank=True, null=True)
    sensor2_humidity = models.FloatField(db_column="SENSOR2_HUMIDITY", blank=True, null=True)
    active_power_total = models.FloatField(db_column="ACTIVE_POWER_TOTAL", blank=True, null=True)
    active_energy_total_high = models.FloatField(db_column="ACTIVE_ENERGY_TOTAL_HIGH", blank=True, null=True)

    class Meta(CommonEtcInfo.Meta):
        db_table = "etc"


class ESS3Etc(CommonEtcInfo):
    sensor2_temperature = models.FloatField(db_column="SENSOR2_TEMPERATURE", blank=True, null=True)
    sensor2_humidity = models.FloatField(db_column="SENSOR2_HUMIDITY", blank=True, null=True)
    active_power_total = models.FloatField(db_column="ACTIVE_POWER_TOTAL", blank=True, null=True)
    active_energy_total_high = models.FloatField(db_column="ACTIVE_ENERGY_TOTAL_HIGH", blank=True, null=True)

    class Meta(CommonEtcInfo.Meta):
        db_table = "etc"


class EssMonitoringLog(models.Model):
    # pass

    # For only unit test
    class Meta:
        managed = False
        db_table = "ess_monitoring_log"
