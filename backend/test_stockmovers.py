import unittest
import json
from unittest.mock import patch, MagicMock
from stockmovers import app 

class TestStockMovers(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch("stockmovers.requests.get")  
    def test_biggest_gainers_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"symbol": "AAPL", "price": 200.00, "changePercentage": 2.5},
            {"symbol": "PLTR", "price": 100.00, "changePercentage": 3.2},
            {"symbol": "NVDA", "price": 150.00, "changePercentage": 1.8}
        ]
        mock_get.return_value = mock_response

        response = self.app.get("/biggest_gainers")
        response_json = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 3)
        self.assertEqual(response_json[0]["symbol"], "AAPL")
        self.assertEqual(response_json[1]["symbol"], "PLTR")
        self.assertEqual(response_json[2]["symbol"], "NVDA")

    @patch("stockmovers.requests.get")
    def test_biggest_losers_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"symbol": "GOOGL", "price": 150.00, "changePercentage": -3.0},
            {"symbol": "TEAM", "price": 200.00, "changePercentage": -2.0},
            {"symbol": "MSFT", "price": 400.00, "changePercentage": -1.0}
        ]
        mock_get.return_value = mock_response

        response = self.app.get("/biggest_losers")
        response_json = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 3)
        self.assertEqual(response_json[0]["symbol"], "GOOGL")
        self.assertEqual(response_json[1]["symbol"], "TEAM")
        self.assertEqual(response_json[2]["symbol"], "MSFT")

    @patch("stockmovers.requests.get")
    def test_biggest_gainers_api_failure(self, mock_get):
        mock_get.side_effect = Exception("API error")

        response = self.app.get("/biggest_gainers")
        self.assertEqual(response.status_code, 200)
        self.assertIn("error", response.get_json())

    @patch("stockmovers.requests.get")
    def test_biggest_losers_api_failure(self, mock_get):
        mock_get.side_effect = Exception("API error")

        response = self.app.get("/biggest_losers")
        self.assertEqual(response.status_code, 200)
        self.assertIn("error", response.get_json())

if __name__ == "__main__":
    unittest.main()
