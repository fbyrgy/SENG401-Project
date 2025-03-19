from flask import Flask, request, jsonify
from google import genai
from dotenv import load_dotenv
import os
from flask_cors import CORS  
from flask import Blueprint

app = Blueprint('llm', __name__)
CORS(app)

load_dotenv()
API_KEY = os.getenv("LLM_API_KEY")
client = genai.Client(api_key=API_KEY)

prefix = "Prentend you're a fincial advisor and keep the response under 3 sentences. "

@app.route("/generate", methods=["POST"])
def generate_content():
    data = request.get_json()
    user_message = data.get("message")
    stock_ticker = data.get("ticker") 
    

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not stock_ticker:
        stock_info = ""
    else:
        stock_info = f"Stock: {stock_ticker}"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prefix + stock_info + " " + user_message
        )
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5005)
