import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from authentication import app as auth_blueprint
import json
import bcrypt

class TestAuthentication(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(auth_blueprint, url_prefix="/auth")
        self.client = self.app.test_client()
        self.app.testing = True

    @patch('authentication.get_db_connection')
    def test_login_success(self, mock_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        password = "password123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        mock_cursor.fetchone.return_value = (hashed_password,)

        request_data = {"email": "test@test.ca", "password": password}
        response = self.client.post('/auth/login', data=json.dumps(request_data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn("Login successful", response.get_data(as_text=True))

    @patch('authentication.get_db_connection')
    def test_login_invalid_credentials(self, mock_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        hashed_password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        mock_cursor.fetchone.return_value = (hashed_password,)

        request_data = {"email": "test@test.ca", "password": "321password"}
        response = self.client.post('/auth/login', data=json.dumps(request_data), content_type='application/json')

        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid credentials", response.get_data(as_text=True))

    @patch('authentication.get_db_connection')
    def test_login_user_not_found(self, mock_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = None

        request_data = {"email": "bob@test.ca", "password": "password123"}
        response = self.client.post('/auth/login', data=json.dumps(request_data), content_type='application/json')

        self.assertEqual(response.status_code, 404)
        self.assertIn("User not found", response.get_data(as_text=True))

    @patch('authentication.get_db_connection')
    def test_login_missing_fields(self, mock_db_connection):
        request_data = {"email": "test@test.ca"}
        response = self.client.post('/auth/login', data=json.dumps(request_data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertIn("Email and password are required", response.get_data(as_text=True))

    @patch('authentication.get_db_connection')
    def test_login_database_error(self, mock_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.execute.side_effect = Exception("Database error")

        request_data = {"email": "test@test.ca", "password": "password123"}
        response = self.client.post('/auth/login', data=json.dumps(request_data), content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertIn("Database error", response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()
