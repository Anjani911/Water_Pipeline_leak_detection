from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import traceback
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename

from utils.blockchain import SimplePrivateBlockchain
from utils.retrain_model import retrain_model

# ------------------------------
# Initialize Flask App
# ------------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
LOG_FILE = "server_log.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

print("🚀 Starting Flask app...")

# ------------------------------
# Load Pre-trained Model
# ------------------------------
MODEL_PATH = "leak_detection_model.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print("⚠️ Error loading model:", e)
    model = None

# ------------------------------
# Initialize Blockchain
# ------------------------------
blockchain = SimplePrivateBlockchain()

# ------------------------------
# Helper: Logging Function
# ------------------------------
def log_event(action, username="system", details=None):
    """Save key actions to server_log.json"""
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": action,
        "username": username,
        "details": details or {}
    }
    try:
        if os.path.exists(LOG_FILE):
            with open(LOG_FILE, "r") as f:
                logs = json.load(f)
        else:
            logs = []

        logs.append(entry)
        with open(LOG_FILE, "w") as f:
            json.dump(logs, f, indent=4)
    except Exception as e:
        print(f"⚠️ Logging failed: {e}")

# ------------------------------
# ROUTES
# ------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "💧 Water Leakage Detection Backend is Running"}), 200


# 🧠 Predict Leak (AI model)
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        df = pd.DataFrame([data])
        expected_columns = [
            "zone_id", "timestamp", "water_supplied_litres",
            "water_consumed_litres", "flowrate_lps", "pressure_psi",
            "latitude", "longitude"
        ]

        missing_cols = [col for col in expected_columns if col not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing fields: {missing_cols}"}), 400

        numeric_df = df.drop(columns=["zone_id", "timestamp"], errors="ignore")

        prediction = model.predict(numeric_df)[0]
        result = "🚨 Leak Detected" if prediction == 1 else "✅ No Leak Detected"

        log_event("prediction", details={"result": result, "input": data})

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "input_data": data
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🔁 Retrain Model (Admin)
@app.route("/retrain", methods=["POST"])
def retrain():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        df = pd.read_csv(file)
        retrain_model(df)

        log_event("retrain_model", details={"file_name": file.filename, "rows": len(df)})

        return jsonify({"message": "✅ Model retrained successfully."}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 📂 Upload Dataset
@app.route("/upload_dataset", methods=["POST"])
def upload_dataset():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No dataset file found"}), 400

        file = request.files["file"]
        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        log_event("upload_dataset", details={"file_name": filename, "file_path": path})

        return jsonify({
            "message": "✅ Dataset uploaded successfully.",
            "file_path": path
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 📸 Upload Photo (Citizen proof)
@app.route("/upload_photo", methods=["POST"])
def upload_photo():
    try:
        if "photo" not in request.files:
            return jsonify({"error": "No photo file found"}), 400

        photo = request.files["photo"]
        filename = secure_filename(photo.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        photo.save(path)

        log_event("upload_photo", details={"photo_name": filename, "photo_path": path})

        return jsonify({
            "message": "📷 Photo uploaded successfully.",
            "file_path": path
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🧾 Citizen Leak Report (adds blockchain reward)
@app.route("/report_leak", methods=["POST"])
def report_leak():
    try:
        data = request.form.to_dict()
        username = data.get("username", "anonymous")

        blockchain.add_transaction(
            sender="System",
            recipient=username,
            amount=5,
            reason="Leak report reward"
        )
        block = blockchain.mine_block()

        log_event("report_leak", username=username, details={"block": block})

        return jsonify({
            "message": "💦 Leak reported successfully.",
            "block": block,
            "reward": "5 WaterCoins added"
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ⛓️ Get Ledger
@app.route("/ledger", methods=["GET"])
def ledger():
    try:
        return jsonify({"ledger": blockchain.chain}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🧾 View Logs
@app.route("/logs", methods=["GET"])
def view_logs():
    """Return server activity logs."""
    try:
        if not os.path.exists(LOG_FILE):
            return jsonify({"logs": []}), 200

        with open(LOG_FILE, "r") as f:
            logs = json.load(f)
        return jsonify({"logs": logs}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ------------------------------
# Run App
# ------------------------------
if __name__ == "__main__":
    print("✅ Flask app is running...")
    app.run(host="0.0.0.0", port=5000)
