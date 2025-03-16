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
        mock_df.to_html.return_value = "<table><tr><td>Mock Data</td></tr></table>"

        mock_time_series.return_value.as_pandas.return_value = mock_df

        response = self.app.get("/time_series?ticker=AAPL&interval=1day&start_date=2025-01-01&end_date=2025-02-01")

        self.assertEqual(response.status_code, 200)
        self.assertIn("<table>", response.data.decode()) 

    def test_time_series_missing_params(self):
        response = self.app.get("/time_series?ticker=AAPL")  

        self.assertEqual(response.status_code, 200)
        self.assertIn("Error: Missing required parameters", response.data.decode())

    @patch("stocks.td.time_series")
    def test_time_series_no_data(self, mock_time_series):
  
        mock_time_series.return_value.as_pandas.return_value = MagicMock(empty=True)

        response = self.app.get("/time_series?ticker=AAPL&interval=1day&start_date=2024-01-01&end_date=2024-02-01")

        self.assertEqual(response.status_code, 500)
        self.assertIn("Error: No data available", response.data.decode())

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


if __name__ == "__main__":
    unittest.main()
