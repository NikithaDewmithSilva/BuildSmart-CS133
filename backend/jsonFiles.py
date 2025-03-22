from flask import Blueprint, jsonify
from flask_cors import CORS
import json
import os

app = Blueprint("app_json", __name__)  # Convert to Blueprint
CORS(app)

BACKEND_FOLDER = os.path.dirname(os.path.abspath(__file__))

# Endpoint to serve output.json


@app.route('/api/output', methods=['GET'])
def get_output():
    output_path = os.path.join(BACKEND_FOLDER, "output.json")
    with open(output_path, 'r') as file:
        data = json.load(file)
    return jsonify(data)

# Endpoint to serve marketPrices.json


@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    prices_path = os.path.join(BACKEND_FOLDER, "marketPrices.json")
    with open(prices_path, 'r') as file:
        data = json.load(file)
    return jsonify(data)
