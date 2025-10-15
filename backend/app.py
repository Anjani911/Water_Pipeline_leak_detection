print("Starting Flask app...")

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

from utils.data_handler import preprocess_data
from utils.blockchain import SimplePrivateBlockchain
from utils.retrain_model import retrain_model

app = Flask(__name__)
CORS(app)

# ---------------- Initialize AI model and Blockchain ----------------
model_path = "model/leak_detection_model.pkl"
model = joblib.load(model_path)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize blockchain
blockchain = SimplePrivateBlockchain()

# ---------------- Admin Routes ----------------
@app.route('/admin/upload', methods=['POST'])
def upload_csv():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    data = pd.read_csv(filepath)
    processed = preprocess_data(data)
    predictions = model.predict(processed)

    data['leak_prediction'] = predictions
    output_path = os.path.join(UPLOAD_FOLDER, "predicted_data.csv")
    data.to_csv(output_path, index=False)

    return jsonify({"message": "File processed successfully", "predictions": predictions.tolist()})


@app.route('/admin/retrain', methods=['POST'])
def retrain():
    new_data_path = os.path.join(UPLOAD_FOLDER, "predicted_data.csv")
    retrain_model(model_path, new_data_path)
    return jsonify({"message": "Model retrained successfully"})


@app.route('/admin/dashboard', methods=['GET'])
def dashboard():
    data_path = os.path.join(UPLOAD_FOLDER, "predicted_data.csv")
    if not os.path.exists(data_path):
        return jsonify({"error": "No data uploaded yet"}), 400

    data = pd.read_csv(data_path)
    total_water = data['water_supplied_litres'].sum()
    total_leaks = data[data['leak_prediction'] == 1].shape[0]
    return jsonify({
        "total_water_supplied": total_water,
        "total_leaks_detected": total_leaks
    })


# ---------------- Citizen Routes ----------------
@app.route('/citizen/report', methods=['POST'])
def citizen_report():
    report = request.json
    block = blockchain.add_block({
        "location": report.get('location'),
        "description": report.get('description'),
        "reward_coins": 10
    })
    return jsonify({"message": "Report added", "block": block})


@app.route('/citizen/coins', methods=['GET'])
def citizen_coins():
    chain = blockchain.get_chain()
    # sum all reward_coins in each block's data
    total = sum(b["data"].get("reward_coins", 0) for b in chain if isinstance(b["data"], dict))
    return jsonify({"total_coins": total})


# ---------------- Run Flask App ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
