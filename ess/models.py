from django.db import models


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


class EssMonitoringLog(models.Model):
    # pass

    # For only unit test
    class Meta:
        managed = False
        db_table = "ess_monitoring_log"
