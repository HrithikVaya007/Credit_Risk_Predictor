from typing import Optional
from pydantic import BaseModel


class Customer(BaseModel):

    # Personal Information
    CODE_GENDER: str
    CNT_CHILDREN: int
    DAYS_BIRTH: int

    NAME_FAMILY_STATUS: str
    NAME_EDUCATION_TYPE: str
    NAME_HOUSING_TYPE: str

    # Employment
    NAME_INCOME_TYPE: str
    OCCUPATION_TYPE: str
    ORGANIZATION_TYPE: str
    DAYS_EMPLOYED: int

    # Financial
    AMT_INCOME_TOTAL: float
    AMT_CREDIT: float
    AMT_ANNUITY: float
    AMT_GOODS_PRICE: float

    # Assets
    FLAG_OWN_CAR: str
    FLAG_OWN_REALTY: str
    OWN_CAR_AGE: Optional[float] = None

    # Family
    CNT_FAM_MEMBERS: float
    NAME_TYPE_SUITE: str

    # Region
    REGION_RATING_CLIENT: int
    REGION_POPULATION_RELATIVE: float