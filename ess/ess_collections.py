from .models import Bank, Rack, Pcs, Etc, ESS2Bank, ESS2Rack, ESS2Pcs, ESS2Etc
from .serializers import (
    BankSerializer,
    EtcSerializer,
    PcsSerializer,
    RackSerializer,
    ESS2BankSerializer,
    ESS2RackSerializer,
    ESS2PcsSerializer,
    ESS2EtcSerializer,
)

ESS_BANK = {
    "ess1": Bank,
    "ess2": ESS2Bank,
}

ESS_RACK = {
    "ess1": Rack,
    "ess2": ESS2Rack,
}

ESS_PCS = {
    "ess1": Pcs,
    "ess2": ESS2Pcs,
}

ESS_ETC = {
    "ess1": Etc,
    "ess2": ESS2Etc,
}

ESS_BANK_SERIALIZER = {
    "ess1": BankSerializer,
    "ess2": ESS2BankSerializer,
}

ESS_RACK_SERIALIZER = {
    "ess1": RackSerializer,
    "ess2": ESS2RackSerializer,
}

ESS_PCS_SERIALIZER = {
    "ess1": PcsSerializer,
    "ess2": ESS2PcsSerializer,
}

ESS_ETC_SERIALIZER = {
    "ess1": EtcSerializer,
    "ess2": ESS2EtcSerializer,
}

ESS_DATA_DATE = {
    "ess1": "2021-10-20",
    "ess2": "2022-02-21",
}
