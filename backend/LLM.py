from flask import Flask, request, jsonify
from google import genai
from dotenv import load_dotenv
import os
from flask_cors import CORS  

app = Flask(__name__)

CORS(app)
prefix = "Keep the respose under 3 sentences. "
load_dotenv()
API_KEY = os.getenv("LLM_API_KEY")
client = genai.Client(api_key=API_KEY)

@app.route("/generate", methods=["POST"])
def generate_content():
    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prefix + user_message
        )
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5005)
