# utils/predict.py
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path("model/leak_detection_model.pkl")

def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

def predict_sample(model, supplied, consumed, flow_rate, pressure):
    arr = np.array([[supplied, consumed, flow_rate, pressure]])
    pred = model.predict(arr)
    # model.predict returns 0/1
    return int(pred[0])

def predict_dataframe(model, df):
    # expects df with columns named exactly:
    # water_supplied_liters, water_consumed_liters, flow_rate_lps, pressure_psi
    X = df[['water_supplied_liters', 'water_consumed_liters', 'flow_rate_lps', 'pressure_psi']]
    preds = model.predict(X.values)
    return preds  # numpy array of 0/1
