import os
import json
import http.client
import urllib.parse
import datetime
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()  

from flask import Blueprint

app = Blueprint('news', __name__)
CORS(app)

@app.route('/news', methods=['GET'])
def get_news():
    keyword = request.args.get('keyword', default='', type=str)
    limit = min(request.args.get('limit', default=3, type=int), 3)  # Ensure within API plan

    # Get today's date and the date one year ago in YYYY-MM-DD format
    today = datetime.date.today().isoformat()
    one_year_ago = (datetime.date.today() - datetime.timedelta(days=365)).isoformat()

    conn = http.client.HTTPSConnection('api.thenewsapi.com')

    params = urllib.parse.urlencode({
        'api_token': os.getenv("TheNews_API_Key"),
        'categories': 'business,tech',
        'limit': limit,
        'search': keyword,
        'language': 'en',
        'published_after': one_year_ago  # Get articles from the past year
    })

    conn.request('GET', f'/v1/news/all?{params}')
    res = conn.getresponse()
    data = res.read()

    try:
        news_json = json.loads(data.decode('utf-8'))

        articles = []
        if 'data' in news_json:
            for article in news_json['data']:
                if article.get('language', 'en') == 'en':  
                    filtered_article = {
                        'headline': article.get('title'),
                        'source': article.get('source'),
                        'link': article.get('url'),
                        'picture': article.get('image_url'),
                        'published_at': article.get('published_at')  # Include date for React
                    }
                    articles.append(filtered_article)

        return jsonify({'articles': articles})

    except Exception as e:
        return jsonify({'error': 'Failed to decode response', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5003)
