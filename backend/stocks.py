# stocks.py
# Twelve Data API
# pip install twelvedata

from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import os
import pandas as pd
import json
from dotenv import load_dotenv
from twelvedata import TDClient
import requests


BASE_URL = "https://api.twelvedata.com"

app = Blueprint('stocks', __name__)
CORS(app)
# loads .env variables
load_dotenv()
API_KEY = os.getenv("twelvedata_API_KEY")

td = TDClient(apikey=API_KEY)


@app.route('/')
def home():
    return "/time_series, /top_gainers_losers , /symbol_search"

# Endpoint for symbol search
@app.route('/symbol_search', methods=['GET'])
def symbol_search():
    
    symbol = request.args.get('symbol')
    figi = request.args.get('figi')  # Optional parameter
    outputsize = request.args.get('outputsize', 30)  # Optional (default is 30)
    show_plan = request.args.get('show_plan', 'false').lower() == 'true'  # Optional (default is false)

    if not symbol:
        return jsonify({"error": "Missing required parameter: symbol."}), 400
    try:
        # Build the request URL with parameters
        params = {
            "symbol": symbol,
            "figi": figi,
            "outputsize": outputsize,
            "show_plan": show_plan,
            "apikey": API_KEY  # Pass the API key as a parameter
        }
        # API request to Twelve Data API
        response = requests.get(BASE_URL+'/symbol_search', params=params)
        data = response.json()

        # Checks 'data'
        if "data" not in data or not data["data"]:
            return jsonify({"error": "No matching symbols found."}), 404

        # Extract information from data
        symbols_data = [
            {
                "symbol": result.get("symbol", "N/A"),
                "instrument_name": result.get("instrument_name", "N/A"),
                "exchange": result.get("exchange", "N/A"),
                "mic_code": result.get("mic_code", "N/A"),
                "exchange_timezone": result.get("exchange_timezone", "N/A"),
                "instrument_type": result.get("instrument_type", "N/A"),
                "country": result.get("country", "N/A"),
            }
            for result in data["data"]
        ]

        return jsonify({"results": symbols_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# endpoint for time series
@app.route('/time_series', methods=['GET'])
def get_time_series():
    ticker = request.args.get('ticker')
    interval = request.args.get('interval')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if not ticker or not interval:
        return jsonify({"error": "Missing required parameters."}), 400
    
    try:
        data = td.time_series(
            symbol=ticker,
            interval=interval,
            start_date=start_date,
            end_date=end_date
        ).as_pandas()
        
        if data is None or data.empty:
            return jsonify({"error": "No data available."}), 500
        
        # Convert DataFrame to JSON format
        json_data = data.reset_index().to_dict(orient='records')
        
        return jsonify({"ticker": ticker, "data": json_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# endpoint to determine if a stock ticker is valid
td_validate = TDClient(apikey=os.getenv("twelvedata_validate_API_KEY"))
@app.route('/validate_ticker', methods=['GET'])
def validate_ticker():
    ticker = request.args.get('ticker')

    if not ticker:
        return jsonify({"error": "Missing required parameter: ticker"}), 400

    try:
        # Call TwelveData's Quote API using the validation API key
        quote_data = td_validate.quote(symbol=ticker)

        if quote_data is None:
            return jsonify({"valid": False}), 200  # Ticker is invalid

        quote_df = quote_data.as_pandas()

        if quote_df.empty or "name" not in quote_df.columns:
            return jsonify({"valid": False}), 200  # No data means invalid ticker

        return jsonify({
            "valid": True,
            "name": quote_df.iloc[0]["name"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# endpoint to get the current price of a stock
@app.route('/quote', methods=['GET'])
def current_price():
    ticker = request.args.get('ticker')

    if not ticker:
        return jsonify({"error": "Missing required parameter: ticker"}), 400

    try:
        quote_data = td.quote(symbol=ticker)
        
        if quote_data is None:
            return jsonify({"error": "No data available for the given ticker."}), 404

        quote_df = quote_data.as_pandas()

        if quote_df.empty:
            return jsonify({"error": "No data available."}), 500

        result = {
            "symbol": ticker,
            "name": quote_df.iloc[0].get("name", "N/A"),
            "current_price": float(quote_df.iloc[0].get("close", "N/A")),
            "percent_change": float(quote_df.iloc[0].get("percent_change", "N/A"))
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004)

