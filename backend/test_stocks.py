import unittest
import json
import pandas as pd
from unittest.mock import patch, MagicMock
from stocks import app, td 

class TestStocks(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch("stocks.td.time_series")
    def test_time_series_success(self, mock_time_series):
        mock_df = MagicMock()
        mock_df.empty = False
        mock_df.reset_index.return_value.to_dict.return_value = [
            {"datetime": "2025-01-01", "open": 150, "high": 155, "low": 149, "close": 152}
        ]

        mock_time_series.return_value.as_pandas.return_value = mock_df

        response = self.app.get("/time_series?ticker=AAPL&interval=1day&start_date=2025-01-01&end_date=2025-02-01")
        response_json = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIn("ticker", response_json)
        self.assertEqual(response_json["ticker"], "AAPL")
        self.assertIn("data", response_json)
        self.assertTrue(len(response_json["data"]) > 0)


    def test_time_series_missing_params(self):
        response = self.app.get("/time_series?ticker=AAPL")  

        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing required parameters", response.data.decode())

    @patch("stocks.td.time_series")
    def test_time_series_no_data(self, mock_time_series):
  
        mock_time_series.return_value.as_pandas.return_value = MagicMock(empty=True)

        response = self.app.get("/time_series?ticker=AAPL&interval=1day&start_date=2024-01-01&end_date=2024-02-01")

        self.assertEqual(response.status_code, 500)
        self.assertIn("No data available", response.data.decode())

    @patch("stocks.td.time_series")
    def test_time_series_api_failure(self, mock_time_series):

        mock_time_series.side_effect = Exception("API error")

        response = self.app.get("/time_series?ticker=AAPL&interval=1day&start_date=2024-01-01&end_date=2024-02-01")

        self.assertEqual(response.status_code, 500)
        self.assertIn("API error", response.data.decode())
    
    @patch("stocks.pd.read_csv")  
    def test_validate_ticker_success(self, mock_read_csv):
        """Test a valid stock ticker lookup."""
        
        # Mock CSV DataFrame
        mock_df = pd.DataFrame({
            "symbol": ["AAPL", "NVDA"],
            "name": ["Apple Inc.", "Nvidia Corp."]
        })

        mock_read_csv.return_value = mock_df 

        response = self.app.get("/validate_ticker?ticker=AAPL")
        
        self.assertEqual(response.status_code, 200)  
        self.assertIn("Apple Inc.", response.data.decode()) 
    
    @patch("stocks.pd.read_csv")  
    def test_validate_ticker_invalid(self, mock_read_csv):

        mock_df = pd.DataFrame({
            "symbol": ["AAPL", "NVDA"],
            "name": ["Apple Inc.", "Nvidia Corp."]
        })

        mock_read_csv.return_value = mock_df 

        response = self.app.get("/validate_ticker?ticker=NONE123")
        
        self.assertEqual(response.status_code, 200)  
        self.assertIn("false", response.data.decode()) 
        
    def test_validate_ticker_missing_param(self):
        response = self.app.get("/validate_ticker?ticker=")
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing required parameter: ticker", response.data.decode())
        
    @patch("stocks.td.quote")
    def test_current_price_success(self, mock_quote):
        mock_df = MagicMock()
        mock_df.empty = False
        mock_df.iloc.__getitem__.side_effect = lambda idx: {
            "name": "Apple Inc.",
            "close": 150.25,
            "percent_change": 1.5
        } if idx == 0 else {}

        mock_quote.return_value.as_pandas.return_value = mock_df

        response = self.app.get("/quote?ticker=AAPL")
        response_json = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json["symbol"], "AAPL")
        self.assertEqual(response_json["name"], "Apple Inc.")
        self.assertEqual(response_json["current_price"], 150.25)
        self.assertEqual(response_json["percent_change"], 1.5)

    def test_current_price_missing_ticker(self):
        response = self.app.get("/quote")  

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "Missing required parameter: ticker")

    @patch("stocks.td.quote")
    def test_current_price_no_data(self, mock_quote):
        mock_quote.return_value.as_pandas.return_value = MagicMock(empty=True)

        response = self.app.get("/quote?ticker=AAPL")

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "No data available.")

    @patch("stocks.td.quote")
    def test_current_price_invalid_ticker(self, mock_quote):
        mock_quote.return_value = None

        response = self.app.get("/quote?ticker=INVALID")

        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "No data available for the given ticker.")

    @patch("stocks.td.quote")
    def test_current_price_api_failure(self, mock_quote):
        mock_quote.side_effect = Exception("API error")

        response = self.app.get("/quote?ticker=AAPL")

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "API error")


if __name__ == "__main__":
    unittest.main()
