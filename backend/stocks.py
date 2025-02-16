# stocks.py
# Twelve Data API

# pip install twelvedata

from twelvedata import TDClient

API_KEY = "6affd8f015f7478ba91f356bf2188ab5" # probably hide this key in github later

td = TDClient(apikey = API_KEY)

# Get historical stock data
historical_data = td.time_series(
    symbol="AAPL",
    interval="1day",
    start_date="2024-01-01",
    end_date="2024-02-15"
).as_pandas()  #can also do json depending on pref

print(historical_data)

# top three winners and top three losers of the last close
symbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"]

latest_prices = {symbol: td.quote(symbol=symbol).as_json() for symbol in symbols}

gainers_losers = [
    {
        "symbol": symbol,
        "percent_change": (float(data["change"]) / float(data["previous_close"])) * 100
    }
    for symbol, data in latest_prices.items()
]

gainers_losers.sort(key=lambda x: x["percent_change"], reverse=True)

top_gainers = gainers_losers[:3]
top_losers = gainers_losers[-3:]

print("Top Gainers:", top_gainers)
print("Top Losers:", top_losers)




