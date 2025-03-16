# stocks.py
# Twelve Data API
# pip install twelvedata

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import json
from dotenv import load_dotenv
from twelvedata import TDClient

app = Flask(__name__)

CORS(app)
# loads .env variables
load_dotenv()
API_KEY = os.getenv("twelvedata_API_KEY")

td = TDClient(apikey=API_KEY)

csv_path = os.path.join(os.path.dirname(__file__),'sp500_companies.csv')

@app.route('/')
def home():
    return "/time_series, /top_gainers_losers"

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

# endpoint for top gainers and losers for S&P 500
@app.route('/top_gainers_losers', methods=['GET'])
def top_gainers_losers():
    try:
        df = pd.read_csv(csv_path)
        symbols = df['Symbol'][:8]  

        latest_prices = {}
        for symbol in symbols:
            quote_data = td.quote(symbol=symbol)
            if quote_data is not None:
                latest_prices[symbol] = quote_data.as_pandas()

        gainers_losers = []
        for symbol, data in latest_prices.items():
            if not data.empty and 'change' in data.columns and 'previous_close' in data.columns:
                change = float(data.iloc[0]['change'])
                previous_close = float(data.iloc[0]['previous_close'])
                percent_change = round((change / previous_close) * 100, 2)
                gainers_losers.append({"symbol": symbol, "percent_change": percent_change})

        if not gainers_losers:
            return jsonify({"error": "No data available."}), 500

        return jsonify({"gainers_losers": gainers_losers})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# endpoint to determine if a stock ticker is valid
@app.route('/validate_ticker', methods=['GET'])
def validate_ticker():
    ticker = request.args.get('ticker')
    ticker = ticker.upper()

    if not ticker:
        return {"error": "Missing required parameter: ticker"}, 400

    try:
        # The file has ';' as the delimiter
        df = pd.read_csv("valid_tickers.csv", delimiter=";")  

        if "symbol" not in df.columns or "name" not in df.columns:
            return {"error": "CSV file format is incorrect"}, 500

        row = df[df["symbol"] == ticker]

        if not row.empty:
            return {
                "valid": True,
                "name": row.iloc[0]["name"]
            }

        return {"valid": False}

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)

