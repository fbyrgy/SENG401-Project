import os
import json
import http.client
import urllib.parse
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()  

app = Flask(__name__)

@app.route('/news', methods=['GET'])
def get_news():
    # 'keyword' and 'limit' parameters for searching
    keyword = request.args.get('keyword', default='', type=str)
    limit = request.args.get('limit', default=10, type=int)
    
    # News API connection
    conn = http.client.HTTPSConnection('api.thenewsapi.com')
    
    # API request query parameters + search to filter articles by keyword 
    params = urllib.parse.urlencode({
        'api_token': os.getenv("TheNews_API_Key"),
        'categories': 'business,tech',  # Adjust categories as needed
        'limit': limit,
        'search': keyword,
        'language': 'en'
    })
    
    conn.request('GET', f'/v1/news/all?{params}')
    res = conn.getresponse()
    data = res.read()
    
    try:
        news_json = json.loads(data.decode('utf-8'))
    except Exception as e:
        return jsonify({'error': 'Failed to decode response', 'details': str(e)}), 500

    # Find articles based on keyword from News API
    articles = []
    if 'data' in news_json:
        for article in news_json['data']:
            filtered_article = {
                'headline': article.get('title'),
                'source': article.get('source'),
                'link': article.get('url'),
                'picture': article.get('image_url')
            }
            articles.append(filtered_article)
    else:
        # If the expected key isn't in the response, return the entire response
        return jsonify(news_json)

    return jsonify({'articles': articles})

if __name__ == '__main__':
    app.run(debug=True, port=5003)
