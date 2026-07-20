import joblib
import pandas as pd
import os
BASE_DIR = os.path.dirname(__file__)

pipeline = joblib.load(os.path.join(BASE_DIR,"model","xgboost_pipeline.pkl"))


def predict(customer):
    df = pd.DataFrame([customer])

    prediction = int(pipeline.predict(df)[0])
    probability = float(pipeline.predict_proba(df)[0][1])

    if prediction == 1:
        risk_level = "High Risk"
        recommendation = "Review Required / Reject"
    else:
        risk_level = "Low Risk"
        recommendation = "Recommended for Approval"

    return {
        "prediction": prediction,
        "risk_level": risk_level,
        "default_probability": f"{probability * 100:.2f}%",
        "loan_recommendation": recommendation
    }