# stocks.py
# Twelve Data API
# pip install twelvedata

import os
import pandas as pd
import json
from dotenv import load_dotenv
from twelvedata import TDClient

# get api key from .env
load_dotenv()
API_KEY = os.getenv("API_KEY")

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

    symbols = df['Symbol'][:8]

    latest_prices = {symbol: td.quote(symbol=symbol).as_pandas() for symbol in symbols}
    
    # calculate percent change and store gainers/losers
    gainers_losers = [
        {
            "symbol": symbol,
            "percent_change": round((float(data["change"]) / float(data["previous_close"])) * 100, 2)
        }
        for symbol, data in latest_prices.items()
        if "change" in data and "previous_close" in data
    ]
    # sort
    gainers_losers.sort(key=lambda x: x["percent_change"], reverse=True)
    
    top_gainers = gainers_losers[:3]
    top_losers = gainers_losers[-3:]
    
    print("Top Gainers:", top_gainers)
    print("Top Losers:", top_losers)
    
    return top_gainers, top_losers

# top_gainers_and_losers()



