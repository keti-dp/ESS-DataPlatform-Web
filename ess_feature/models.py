from django.db import models


class ProtectionMapErrorCode(models.Model):
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "protectionmap_error_code"


class ProtectionMapLevel(models.Model):
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "protectionmap_level"


class ProtectionMapFeature(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    error_code = models.ForeignKey(ProtectionMapErrorCode, on_delete=models.PROTECT, db_column="ERROR_CODE")
    level = models.ForeignKey(ProtectionMapLevel, on_delete=models.PROTECT, db_column="LEVEL")
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    operating_site = models.IntegerField(db_column="OPERATING_SITE")
    description = models.CharField(max_length=300, blank=True, null=True, db_column="DESCRIPTION")

    class Meta:
        managed = False
        db_table = "protectionmap_feature_new"


class ProtectionMapFeatureTest(models.Model):
    timestamp = models.DateTimeField(db_column="TIMESTAMP", primary_key=True)
    error_code = models.ForeignKey(ProtectionMapErrorCode, on_delete=models.PROTECT, db_column="ERROR_CODE")
    level = models.ForeignKey(ProtectionMapLevel, on_delete=models.PROTECT, db_column="LEVEL", blank=True, null=True)
    bank_id = models.IntegerField(db_column="BANK_ID")
    rack_id = models.IntegerField(db_column="RACK_ID")
    operating_site = models.IntegerField(db_column="OPERATING_SITE")
    description = models.CharField(db_column="DESCRIPTION", max_length=300, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "protectionmap_feature_new_test"
