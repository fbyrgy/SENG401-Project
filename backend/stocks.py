# stocks.py
# Twelve Data API
# pip install twelvedata

import pandas as pd
import json
from twelvedata import TDClient

API_KEY = "6affd8f015f7478ba91f356bf2188ab5" # probably hide this key in github later

td = TDClient(apikey = API_KEY)

def get_time_series(ticker: str, interval: str, start_date: str = None, end_date: str = None):

    # Fetch time series data
    time_series = td.time_series(
        symbol=ticker,
        interval=interval,
        start_date=start_date,
        end_date=end_date
    ).as_pandas()
    
    return time_series

# data = get_time_series("AAPL", "1day")
# print(data)

def top_gainers_and_losers():
    df = pd.read_csv('backend/sp500_companies.csv')

    # Extract the 'Symbol' column
    symbols = df['Symbol'][:8]

    # Fetch latest price data for all tickers
    latest_prices = {symbol: td.quote(symbol=symbol).as_pandas() for symbol in symbols}
    
    # Calculate percent change and store gainers/losers
    gainers_losers = [
        {
            "symbol": symbol,
            "percent_change": round((float(data["change"]) / float(data["previous_close"])) * 100, 2)
        }
        for symbol, data in latest_prices.items()
        if "change" in data and "previous_close" in data  # Ensure required fields exist
    ]
    
    # Sort by percent change
    gainers_losers.sort(key=lambda x: x["percent_change"], reverse=True)
    
    # Extract top gainers and losers
    top_gainers = gainers_losers[:3]
    top_losers = gainers_losers[-3:]
    
    print("Top Gainers:", top_gainers)
    print("Top Losers:", top_losers)
    
    return top_gainers, top_losers

# top_gainers_and_losers()



