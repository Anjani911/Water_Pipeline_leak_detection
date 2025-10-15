# utils/retrain_model.py

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

def retrain_model(existing_model_path, new_data_path, save_path):
    """
    Retrain the ML model using new admin-uploaded CSV data.
    """
    try:
        # Load the existing trained model
        model = joblib.load(existing_model_path)

        # Load new training data
        new_data = pd.read_csv(new_data_path)

        # Check if required columns are present
        required_columns = ['water_supplied_litres', 'water_consumed_litres', 'flowrate_lps', 'pressure_psi', 'leak']
        for col in required_columns:
            if col not in new_data.columns:
                raise ValueError(f"Missing column in new data: {col}")

        # Separate features and target
        X = new_data[['water_supplied_litres', 'water_consumed_litres', 'flowrate_lps', 'pressure_psi']]
        y = new_data['leak']

        # Retrain model
        model.fit(X, y)

        # Save the updated model
        joblib.dump(model, save_path)

        return {"message": "Model retrained successfully", "status": "success"}

    except Exception as e:
        return {"message": str(e), "status": "error"}
