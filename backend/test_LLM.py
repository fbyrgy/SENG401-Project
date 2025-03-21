import unittest
import json
from unittest.mock import patch, MagicMock
from LLM import app, client 
from flask import Flask
from LLM import app as llm_blueprint

class TestLLM(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(llm_blueprint, url_prefix="/llm")
        self.client = self.app.test_client()
        self.app.testing = True

    @patch("LLM.client")
    def test_generate_content_success(self, mock_client):
        mock_response = MagicMock()
        mock_response.text = "Mocked response"
  
        mock_client.models.generate_content.return_value = mock_response

        request_data = {"message": "Test message"}
        response = self.client.post(
            "/llm/generate", data=json.dumps(request_data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.get_json())
        self.assertEqual(response.get_json()["response"], "Mocked response")

    def test_generate_content_missing_message(self):
        request_data = {}
        response = self.client.post(
            "/llm/generate", data=json.dumps(request_data), content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "No message provided")

    @patch("LLM.client")  
    def test_generate_content_api_failure(self, mock_client):

        mock_client.models.generate_content.side_effect = Exception("API error")

        request_data = {"message": "Test message"}
        response = self.client.post(
            "/llm/generate", data=json.dumps(request_data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "API error")

if __name__ == "__main__":
    unittest.main()
