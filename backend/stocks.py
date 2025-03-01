# stocks.py
# Twelve Data API
# pip install twelvedata

from flask import Flask, request
import os
import pandas as pd
from dotenv import load_dotenv
from twelvedata import TDClient

app = Flask(__name__)

# loads .env variables
load_dotenv()
API_KEY = os.getenv("twelvedata_API_KEY")

td = TDClient(apikey=API_KEY)


@app.route('/')
def home():
    return "/time_series, /top_gainers_losers"

# endpoint for time series
@app.route('/time_series', methods=['GET'])
def get_time_series():
    ticker = request.args.get('ticker')
    interval = request.args.get('interval')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if not ticker or not interval:
        return "Error: Missing required parameters. Example format: /time_series?ticker=AAPL&interval=1day&start_date=2024-01-01&end_date=2024-02-01"

    try:
        data = td.time_series(
            symbol=ticker,
            interval=interval,
            start_date=start_date,
            end_date=end_date
        ).as_pandas()

        if data is None or data.empty:
            return "Error: No data available.", 500

        table_html = data.to_html()

        return f"""
        <html>
            <head>
                <title>{ticker} Time Series Data</title>
            </head>
            <body>
                <h2>{ticker} Stock Prices ({start_date} - {end_date})</h2>
                {table_html}
            </body>
        </html>
        """
    except Exception as e:
        return str(e), 500

# endpoint for top gainers and losers for S&P 500
@app.route('/top_gainers_losers', methods=['GET'])
def top_gainers_losers():
    try:
        df = pd.read_csv('backend/sp500_companies.csv')
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
                gainers_losers.append([symbol, percent_change])

        if not gainers_losers:
            return "No data available.", 500

        gainers_losers_df = pd.DataFrame(gainers_losers, columns=['Symbol', 'Percent Change'])

        table_html = gainers_losers_df.to_html(index=False)

        return f"""
        <html>
            <head>
                <title>Top Gainers and Losers</title>
            </head>
            <body>
                <h2>Top Gainers and Losers</h2>
                {table_html}
            </body>
        </html>
        """
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)

