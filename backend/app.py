from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import traceback
import os
from werkzeug.utils import secure_filename

from utils.blockchain import SimplePrivateBlockchain
from utils.retrain_model import retrain_model

# ------------------------------
# Initialize Flask App
# ------------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

print("🚀 Starting Flask app...")

# ------------------------------
# Load Pre-trained Model
# ------------------------------
MODEL_PATH = "leak_detection_model.pkl"  # ✅ your AI model

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

        return jsonify({"message": "✅ Model retrained successfully."}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🧾 Citizen Leak Report (adds reward)
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

        return jsonify({
            "message": "💦 Leak reported successfully.",
            "block": block,
            "reward": "5 WaterCoins added"
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
        path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        photo.save(path)

        return jsonify({
            "message": "📷 Photo uploaded successfully.",
            "file_path": path
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 📂 Upload New Dataset (Admin)
@app.route("/upload_dataset", methods=["POST"])
def upload_dataset():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No dataset file found"}), 400

        file = request.files["file"]
        filename = secure_filename(file.filename)
        path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(path)

        return jsonify({
            "message": "✅ Dataset uploaded successfully.",
            "file_path": path
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


# ------------------------------
# Run App
# ------------------------------
if __name__ == "__main__":
    print("✅ Flask app is running...")
    app.run(host="0.0.0.0", port=5000)
