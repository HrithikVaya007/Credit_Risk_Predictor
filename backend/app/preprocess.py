import pandas as pd


def load_data(path):
    return pd.read_csv(path)


def clean_data(df):

    df = df.drop_duplicates()

    numerical = df.select_dtypes(include=["int64", "float64"]).columns
    df[numerical] = df[numerical].fillna(df[numerical].median())

    categorical = df.select_dtypes(include=["object"]).columns
    df[categorical] = df[categorical].fillna("Unknown")

    return df


def split_features_target(df):

    FEATURES = [
        "CODE_GENDER",
        "CNT_CHILDREN",
        "DAYS_BIRTH",
        "NAME_FAMILY_STATUS",
        "NAME_EDUCATION_TYPE",
        "NAME_HOUSING_TYPE",
        "NAME_INCOME_TYPE",
        "OCCUPATION_TYPE",
        "ORGANIZATION_TYPE",
        "DAYS_EMPLOYED",
        "AMT_INCOME_TOTAL",
        "AMT_CREDIT",
        "AMT_ANNUITY",
        "AMT_GOODS_PRICE",
        "FLAG_OWN_CAR",
        "FLAG_OWN_REALTY",
        "OWN_CAR_AGE",
        "CNT_FAM_MEMBERS",
        "NAME_TYPE_SUITE",
        "REGION_RATING_CLIENT",
        "REGION_POPULATION_RELATIVE"
    ]

    X = df[FEATURES]
    y = df["TARGET"]

    return X, y


def preprocess_data(path):

    df = load_data(path)

    df = clean_data(df)

    X, y = split_features_target(df)

    return X, y