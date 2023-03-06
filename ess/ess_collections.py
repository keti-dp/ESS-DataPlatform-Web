from .models import Bank, Rack, Pcs, Etc, ESS2Bank, ESS2Rack, ESS2Pcs, ESS2Etc, ESS3Bank, ESS3Rack, ESS3Pcs, ESS3Etc
from .serializers import (
    BankSerializer,
    EtcSerializer,
    PcsSerializer,
    RackSerializer,
    ESS2BankSerializer,
    ESS2RackSerializer,
    ESS2PcsSerializer,
    ESS2EtcSerializer,
    ESS3BankSerializer,
    ESS3RackSerializer,
    ESS3PcsSerializer,
    ESS3EtcSerializer,
)

ESS_BANK = {
    "ess1": Bank,
    "ess2": ESS2Bank,
    "ess3": ESS3Bank,
}

ESS_RACK = {
    "ess1": Rack,
    "ess2": ESS2Rack,
    "ess3": ESS3Rack,
}

ESS_PCS = {
    "ess1": Pcs,
    "ess2": ESS2Pcs,
    "ess3": ESS3Pcs,
}

ESS_ETC = {
    "ess1": Etc,
    "ess2": ESS2Etc,
    "ess3": ESS3Etc,
}

ESS_BANK_SERIALIZER = {
    "ess1": BankSerializer,
    "ess2": ESS2BankSerializer,
    "ess3": ESS3BankSerializer,
}

ESS_RACK_SERIALIZER = {
    "ess1": RackSerializer,
    "ess2": ESS2RackSerializer,
    "ess3": ESS3RackSerializer,
}

ESS_PCS_SERIALIZER = {
    "ess1": PcsSerializer,
    "ess2": ESS2PcsSerializer,
    "ess3": ESS3PcsSerializer,
}

ESS_ETC_SERIALIZER = {
    "ess1": EtcSerializer,
    "ess2": ESS2EtcSerializer,
    "ess3": ESS3EtcSerializer,
}

# Start date which include full data of a day
ESS_DATA_DATE = {
    "ess1": "2021-10-20",
    "ess2": "2022-02-21",
    "ess3": "2023-01-06",
}
