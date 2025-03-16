import unittest
from unittest.mock import patch, MagicMock
from connection import app
import json

class TestConnection(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('connection.get_db_connection')
    def test_add_user_success(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        request_data = {
            "email": "test@example.com",
            "password": "securepassword"
        }

        response = self.app.post('/add_user', 
                                 data=json.dumps(request_data), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertIn("User test@example.com added successfully!", response.get_data(as_text=True))
        
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('connection.get_db_connection')
    def test_add_user_missing_email(self, mock_db_connection):

        response = self.app.post('/add_user', 
                                 data=json.dumps({"password": "securepassword"}), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and password are required", response.get_data(as_text=True))
       
    @patch('connection.get_db_connection') 
    def test_add_user_missing_password(self, mock_db_connection):

        response = self.app.post('/add_user', 
                                 data=json.dumps({"email": "test@example.com"}), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and password are required", response.get_data(as_text=True))
        
    @patch('connection.get_db_connection')
    def test_add_user_database_error(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.execute.side_effect = Exception("Database error") # Raise an exception
        
        request_data = {
            "email": "test@example.com",
            "password": "securepassword"
        }
        
        response = self.app.post('/add_user', 
                                 data=json.dumps(request_data), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.get_data(as_text=True))
        
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('connection.get_db_connection')
    def test_add_watchlist_success(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = None
        
        request_data = {
            "user_id": 1,
            "stock_ticker": "AAPL"
        }

        response = self.app.post('/add_watchlist', 
                                    data=json.dumps(request_data), 
                                    content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertIn("Stock AAPL added to watchlist!", response.get_data(as_text=True))
        
        mock_cursor.execute.assert_called()
        mock_conn.commit.assert_called_once()
        
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('connection.get_db_connection')
    def test_add_watchlist_existing_stock(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = (1,)

        request_data = {
            "user_id": 1,
            "stock_ticker": "AAPL"
        }

        response = self.app.post('/add_watchlist', 
                                    data=json.dumps(request_data), 
                                    content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Stock AAPL is already in your watchlist.", response.get_data(as_text=True))

    @patch('connection.get_db_connection')
    def test_add_watchlist_database_error(self, mock_db_connection):
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.execute.side_effect = Exception("Database error")
        
        request_data = {
            "user_id": 1,
            "stock_ticker": "AAPL"
        }
        
        response = self.app.post('/add_watchlist', 
                                    data=json.dumps(request_data), 
                                    content_type='application/json')
        
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.get_data(as_text=True))
        
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()
        
    @patch('connection.get_db_connection')
    def test_get_watchlist_success(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        mock_cursor.fetchone.return_value = {"user_id": 1}
        mock_cursor.fetchall.return_value = [{"stock_ticker": "AAPL"}, {"stock_ticker": "NVDA"}]
        
        response = self.app.get('/get_watchlist?email=test@example.com')
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("AAPL", response.get_data(as_text=True))
        self.assertIn("NVDA", response.get_data(as_text=True))

    @patch('connection.get_db_connection')
    def test_get_watchlist_incorrect_stock(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        mock_cursor.fetchone.return_value = {"user_id": 1}
        mock_cursor.fetchall.return_value = [{"stock_ticker": "AAPL"}, {"stock_ticker": "NVDA"}]
        
        response = self.app.get('/get_watchlist?email=test@example.com')
        
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("PLTR", response.get_data(as_text=True))
        
    @patch('connection.get_db_connection')
    def test_get_user_id_success(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = {"user_id": 1}
        
        request_data = {"email": "test@example.com"}
        response = self.app.post('/get_user_id', 
                                 data=json.dumps(request_data), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("user_id", response.get_data(as_text=True))
        
    @patch('connection.get_db_connection')
    def test_get_user_id_not_found(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = None
        
        request_data = {"email": "unknown@example.com"}
        response = self.app.post('/get_user_id', 
                                 data=json.dumps(request_data), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 404)
        self.assertIn("User not found", response.get_data(as_text=True))
        
    @patch('connection.get_db_connection')
    def test_get_user_id_database_error(self, mock_db_connection):

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.execute.side_effect = Exception("Database error")
        
        request_data = {"email": "test@example.com"}
        response = self.app.post('/get_user_id', 
                                 data=json.dumps(request_data), 
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.get_data(as_text=True))
        
if __name__ == '__main__':
    unittest.main()
