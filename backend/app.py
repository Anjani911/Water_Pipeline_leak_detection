from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from utils.blockchain import SimplePrivateBlockchain
from utils.retrain_model import retrain_model

# ------------------------------
# Initialize Flask App
# ------------------------------
app = Flask(__name__)
CORS(app)

print("🚀 Starting Flask app...")

# ------------------------------
# Load pre-trained ML model
# ------------------------------
try:
    model = joblib.load("models/leak_detection_model.pkl")
    print("✅ Model loaded successfully.")
except Exception as e:
    print("⚠️ Error loading model:", e)
    model = None

# ------------------------------
# Initialize Private Blockchain
# ------------------------------
blockchain = SimplePrivateBlockchain()

# ------------------------------
# Routes
# ------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Water Leakage Detection Backend is Running"}), 200


# 🧠 Predict Leak Route
@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict if there is a leakage based on zone water data.
    """
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        prediction = model.predict(df)[0]
        result = "Leak Detected" if prediction == 1 else "No Leak"

        return jsonify({
            "prediction": int(prediction),
            "result": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔁 Retrain Model Route (Admin uploads new CSV)
@app.route("/retrain", methods=["POST"])
def retrain():
    """
    Admin uploads new CSV file for retraining.
    """
    try:
        file = request.files['file']
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        df = pd.read_csv(file)
        retrain_model(df)

        return jsonify({"message": "Model retrained successfully with new data."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🧾 Citizen Report Leak Route (with blockchain reward)
@app.route("/report_leak", methods=["POST"])
def report_leak():
    """
    Citizen reports a visible leak (photo + location + description).
    Blockchain rewards user with coins.
    """
    try:
        data = request.form.to_dict()
        username = data.get("username", "anonymous")

        # Reward 5 tokens per valid leak report
        blockchain.add_transaction(
            sender="System",
            recipient=username,
            amount=5,
            reason="Leak report reward"
        )

        # Add block to chain
        block = blockchain.mine_block()

        return jsonify({
            "message": "Leak reported successfully.",
            "block": block,
            "reward": "5 WaterCoins added"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ⛓️ Get Blockchain Ledger
@app.route("/ledger", methods=["GET"])
def ledger():
    """
    Return the blockchain ledger.
    """
    try:
        chain = blockchain.chain
        return jsonify({"ledger": chain}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------
# Run App
# ------------------------------
if __name__ == "__main__":
    print("✅ Flask app is running...")
    app.run(host="0.0.0.0", port=5000)
