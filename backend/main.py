from flask import Flask
from flask_cors import CORS
from connection import app as connection_app
from authentication import app as authentication_app
from news import app as news_app
from stocks import app as stocks_app
from LLM import app as llm_app
from stockmovers import app as stockmovers_app

app = Flask(__name__)
CORS(app)

app.register_blueprint(connection_app, url_prefix='/connection')
app.register_blueprint(authentication_app, url_prefix='/authentication')
app.register_blueprint(news_app, url_prefix='/news')
app.register_blueprint(stocks_app, url_prefix='/stocks')
app.register_blueprint(llm_app, url_prefix='/llm')
app.register_blueprint(stockmovers_app, url_prefix='/stockmovers')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
