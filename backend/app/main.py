from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import Customer
from app.predict import predict


app = FastAPI(
    title="Credit Risk Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Credit Risk Prediction API is running."
    }


@app.post("/predict")
def predict_customer(customer: Customer):

    customer_data = customer.model_dump()

    result = predict(customer_data)

    return result