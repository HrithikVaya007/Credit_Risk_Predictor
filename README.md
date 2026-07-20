# CreditRiskPrediction

An AI-powered web application that predicts credit loan default risk using an XGBoost machine learning model. Users fill in a loan application form, and the model returns a prediction — **Low Risk** or **High Risk** — along with a default probability score.

---

## Project Structure

```
CreditRiskPrediction/
├── backend/                  # Python FastAPI server
│   ├── app/
│   │   ├── main.py           # API entry point, routes
│   │   ├── schemas.py        # Request body validation (Pydantic)
│   │   ├── predict.py        # Loads model and runs prediction
│   │   ├── preprocess.py     # Data cleaning and feature extraction
│   │   ├── train.py          # Model training script
│   │   ├── utils.py          # Save/load model helpers
│   │   └── model/
│   │       └── xgboost_pipeline.pkl   # Trained ML pipeline
│   ├── dataset/
│   │   └── application_train.csv      # Training data (Home Credit dataset)
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
│
└── frontend/                 # React + Vite web app
    ├── src/
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # React entry point
    │   ├── pages/
    │   │   └── Home.jsx       # Main page — assembles all components
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation bar
    │   │   ├── LoanForm.jsx        # Main input form (21 fields)
    │   │   ├── PredictionCard.jsx  # Displays prediction result
    │   │   └── LoadingSpinner.jsx  # Shown while API call is in progress
    │   └── services/
    │       └── api.js         # API utility function (fetch wrapper)
    ├── .env                   # Frontend environment variables
    └── package.json           # Node dependencies
```

---

## Backend

**Tech Stack:** Python, FastAPI, XGBoost, scikit-learn, Pandas, Pydantic, Joblib

The backend is a REST API that exposes a single `/predict` endpoint. It loads a pre-trained machine learning pipeline and uses it to classify loan applicants as high or low credit risk.

### How It Works

```
Request (JSON)
     │
     ▼
 schemas.py  ──── Validates all 21 input fields using Pydantic
     │
     ▼
 predict.py  ──── Converts input dict → Pandas DataFrame
     │             Runs pipeline.predict() and pipeline.predict_proba()
     ▼
 Response (JSON)
```

### Files Explained

#### `main.py` — API Entry Point
- Creates the FastAPI app
- Adds **CORS middleware** so the React frontend (port 5173) can call the API (port 8000)
- Defines two routes:
  - `GET /` — Health check, returns a status message
  - `POST /predict` — Accepts customer data, returns prediction result

#### `schemas.py` — Input Validation
- Defines the `Customer` Pydantic model with all **21 required fields**
- Ensures the API receives correct types (e.g. `int`, `float`, `str`)
- `OWN_CAR_AGE` is `Optional[float]` — it can be `null` if the customer has no car

Key fields the model expects:

| Field | Type | Description |
|---|---|---|
| `DAYS_BIRTH` | `int` (negative) | Age in days e.g. age 30 = `-10950` |
| `DAYS_EMPLOYED` | `int` (negative) | Employment duration in days |
| `AMT_INCOME_TOTAL` | `float` | Annual income |
| `AMT_CREDIT` | `float` | Loan credit amount |
| `AMT_ANNUITY` | `float` | Monthly loan annuity |
| `AMT_GOODS_PRICE` | `float` | Price of goods being bought |
| `FLAG_OWN_CAR` | `str` | `"Y"` or `"N"` |
| `FLAG_OWN_REALTY` | `str` | `"Y"` or `"N"` |
| `CODE_GENDER` | `str` | `"M"` or `"F"` |

#### `predict.py` — Prediction Logic
- Loads the trained `xgboost_pipeline.pkl` at **startup** (once, not per request)
- Uses `os.path` relative to `__file__` so the path always works regardless of where `uvicorn` is launched from
- Converts the input dict into a single-row Pandas DataFrame
- Calls `pipeline.predict()` → `0` (Low Risk) or `1` (High Risk)
- Calls `pipeline.predict_proba()` → probability of default as a percentage
- Returns a structured dict: `prediction`, `risk_level`, `default_probability`, `loan_recommendation`

#### `preprocess.py` — Data Preprocessing (used during training)
- `load_data(path)` — reads the CSV dataset
- `clean_data(df)` — removes duplicates, fills missing numerics with median, fills missing categoricals with `"Unknown"`
- `split_features_target(df)` — extracts the 21 feature columns and the `TARGET` label column

#### `train.py` — Model Training Script
- Builds a **scikit-learn Pipeline** with two stages:
  1. **Preprocessor** (`ColumnTransformer`):
     - Numerical columns → `SimpleImputer(strategy="median")`
     - Categorical columns → `SimpleImputer` + `OneHotEncoder(handle_unknown="ignore")`
  2. **Classifier** → `XGBClassifier` (200 trees, learning rate 0.05, max depth 6)
- Splits data 80/20 train/test with stratification
- Saves the full pipeline as `xgboost_pipeline.pkl` using `joblib`

> To retrain the model, run from the `backend/` directory:
> ```bash
> python -m app.train
> ```

---

## 🌐 Frontend

**Tech Stack:** React, Vite, Vanilla CSS, react-icons

The frontend is a single-page React application. It renders a loan application form, sends the data to the backend API, and displays the prediction result.

### How It Works

```
User fills form (LoanForm.jsx)
        │
        ▼
Validation runs (validateForm)
        │
        ▼
Numeric fields converted (age × -365, etc.)
        │
        ▼
POST /predict → FastAPI backend
        │
        ▼
Response → setPrediction(data)
        │
        ▼
PredictionCard renders result
```

### Files Explained

#### `main.jsx` — React Entry Point
- Mounts the `<App />` component into the `#root` div in `index.html`

#### `App.jsx` — Root Component
- Renders the `<Home />` page

#### `pages/Home.jsx` — Page Layout
- Holds the two key pieces of state:
  - `loading` — `true` while the API call is in progress
  - `prediction` — the result object returned from the backend
- Renders `<Navbar />`, `<LoanForm />`, and conditionally `<PredictionCard />` when a result exists

#### `components/LoanForm.jsx` — Main Form (21 fields)
- Manages all form state in a single `formData` object
- `handleChange` — updates `formData` on every input change
- `validateForm` — checks all required fields; stores errors in `errors` state
- `handleSubmit` — on valid submission:
  - Converts string values to proper numeric types (`parseInt`, `parseFloat`)
  - Converts age (years) and employment (years) to **negative days** as required by the model
  - POSTs to `${VITE_API_URL}/predict`
  - Calls `setPrediction(data)` to trigger result display
- Wrapped in a real `<form>` element with `onSubmit={handleSubmit}`

#### `components/PredictionCard.jsx` — Result Display
- Receives the `prediction` object as a prop
- Shows ✅ green check for **Low Risk** or ❌ red icon for **High Risk**
- Displays `default_probability` (e.g. `"12.45%"`) and `loan_recommendation`

#### `components/LoadingSpinner.jsx` — Loading State
- Rendered while `loading === true` (between form submit and API response)

#### `components/Navbar.jsx` — Navigation Bar
- Displays the **CreditAI** logo and nav links

#### `services/api.js` — API Service
- Exports `predictCreditRisk(payload)` as a reusable fetch wrapper
- Handles non-OK HTTP responses by throwing a readable error
- Uses `VITE_API_URL` from `.env` so the base URL is configurable

---

## 🔄 Data Flow (End-to-End)

```
[User] fills form in browser
    ↓
[LoanForm.jsx] validates fields, converts types
    ↓
POST http://127.0.0.1:8000/predict
    JSON body: { CODE_GENDER, CNT_CHILDREN, DAYS_BIRTH, ... }
    ↓
[FastAPI main.py] receives request
    ↓
[schemas.py] Pydantic validates all 21 fields
    ↓
[predict.py] DataFrame → pipeline.predict()
    ↓
Returns: { prediction, risk_level, default_probability, loan_recommendation }
    ↓
[PredictionCard.jsx] renders result to the user
```

---

## 🚀 Running the App

### Backend
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
# Running at: http://127.0.0.1:8000
# Swagger UI: http://127.0.0.1:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Running at: http://localhost:5173
```

---

## 🌍 Environment Variables

### `frontend/.env`
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## 📦 Backend Dependencies

| Package | Purpose |
|---|---|
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server to run FastAPI |
| `pydantic` | Input validation via data models |
| `pandas` | DataFrame construction for model input |
| `xgboost` | Gradient boosting classifier |
| `scikit-learn` | Pipeline, preprocessing, train/test split |
| `joblib` | Save and load the trained pipeline |
| `python-dotenv` | Load `.env` variables |
