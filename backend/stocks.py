# stocks.py
# Twelve Data API
# pip install twelvedata

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





