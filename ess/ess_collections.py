from .models import Bank, Rack, Pcs, Etc, SecondESSBank, SecondESSRack, SecondESSPcs, SecondESSEtc
from .serializer import (
    BankSerializer,
    EtcSerializer,
    PcsSerializer,
    RackSerializer,
    SecondESSBankSerializer,
    SecondESSRackSerializer,
    SecondESSPcsSerializer,
    SecondESSEtcSerializer,
)

ESS_BANK = {
    "ess1": Bank,
    "ess2": SecondESSBank,
}

ESS_RACK = {
    "ess1": Rack,
    "ess2": SecondESSRack,
}

ESS_PCS = {
    "ess1": Pcs,
    "ess2": SecondESSPcs,
}

ESS_ETC = {
    "ess1": Etc,
    "ess2": SecondESSEtc,
}

ESS_BANK_SERIALIZER = {
    "ess1": BankSerializer,
    "ess2": SecondESSBankSerializer,
}

ESS_RACK_SERIALIZER = {
    "ess1": RackSerializer,
    "ess2": SecondESSRackSerializer,
}

ESS_PCS_SERIALIZER = {
    "ess1": PcsSerializer,
    "ess2": SecondESSPcsSerializer,
}

ESS_ETC_SERIALIZER = {
    "ess1": EtcSerializer,
    "ess2": SecondESSEtcSerializer,
}

ESS_DATA_DATE = {
    "ess1": "2021-10-20",
    "ess2": "2022-02-21",
}
