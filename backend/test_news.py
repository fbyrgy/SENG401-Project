import unittest
from unittest.mock import patch, MagicMock
from news import app as news_blueprint
from flask import Flask
import json

class TestNews(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(news_blueprint, url_prefix="/news")
        self.client = self.app.test_client()
        self.app.testing = True

    @patch('http.client.HTTPSConnection')
    def test_get_news_success(self, mock_http):
        mock_conn = MagicMock()
        mock_http.return_value = mock_conn
        mock_response = MagicMock()

        title = "Stock Market News"
        source = "Bloomberg"
        mock_response.read.return_value = json.dumps({
            "data": [
                {
                    "title": title,
                    "source": source,
                    "url": "https://example.ca/article1",
                    "image_url": "https://example.ca/image1.jpg"
                }
            ]
        }).encode('utf-8')

        mock_conn.getresponse.return_value = mock_response
        
        response = self.client.get('/news/news?keyword=tech&limit=1')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('articles', data)
        self.assertEqual(len(data['articles']), 1)
        self.assertEqual(data['articles'][0]['headline'], title)
        self.assertEqual(data['articles'][0]['source'], source)

    @patch('http.client.HTTPSConnection')
    def test_get_news_no_articles(self, mock_http):
        mock_conn = MagicMock()
        mock_http.return_value = mock_conn
        mock_response = MagicMock()

        # Mock empty API response
        mock_response.read.return_value = json.dumps({"data": []}).encode('utf-8')
        mock_conn.getresponse.return_value = mock_response
        
        response = self.client.get('/news/news?keyword=unknown&limit=1')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('articles', data)
        self.assertEqual(len(data['articles']), 0)

    @patch('http.client.HTTPSConnection')
    def test_get_news_invalid_response(self, mock_http):
        mock_conn = MagicMock()
        mock_http.return_value = mock_conn
        mock_response = MagicMock()

        mock_response.read.return_value = b'invalid json'
        mock_conn.getresponse.return_value = mock_response
        
        response = self.client.get('/news/news?keyword=tech&limit=1')
        
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()
