# Using the stock gainers and losers endpoints from FMP

from dotenv import load_dotenv
from flask import Flask, jsonify, Blueprint
from flask_cors import CORS
import requests
import os

app = Blueprint('stockmovers', __name__)
CORS(app)   
load_dotenv()
API_KEY = os.getenv("FMP_API_KEY")
BASE_URL = "https://financialmodelingprep.com/stable"

def fetch_top_stocks(endpoint, n=3):
    url = f"{BASE_URL}/{endpoint}?apikey={API_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        return data[:n] # Return top n stocks 
    except requests.RequestException as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": str(e)}

@app.route("/biggest_gainers", methods=["GET"])
def get_biggest_gainers():
    return jsonify(fetch_top_stocks("biggest-gainers", n=3))

@app.route("/biggest_losers", methods=["GET"])
def get_biggest_losers():
    return jsonify(fetch_top_stocks("biggest-losers", n=3))

if __name__ == "__main__":
    app.run(port=5006)
