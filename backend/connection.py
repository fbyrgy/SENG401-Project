from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import os
from dotenv import load_dotenv  #pip install python-dotenv

# Load environment variables from .env
load_dotenv()

# Get database password
DB_PASSWORD = os.getenv("DB_PASSWORD")

app = Flask(__name__)
CORS(app)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password= DB_PASSWORD,
        database="finance_app"
    )

# Route to add a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password") 

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Hash the password before storing it in the database
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        sql = "INSERT INTO users (email, password_hash) VALUES (%s, %s)"
        cursor.execute(sql, (email, password_hash))
        conn.commit()
        return jsonify({"message": f"User {email} added successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()  

# Route to add a stock ticker to the watchlist
@app.route('/add_watchlist', methods=['POST'])
def add_watchlist():
    data = request.get_json()
    user_id = data.get("user_id")
    stock_ticker = data.get("stock_ticker")

    if not user_id or not stock_ticker:
        return jsonify({"error": "User ID and stock ticker are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql = "INSERT INTO watchlist (user_id, stock_ticker) VALUES (%s, %s)"
        cursor.execute(sql, (user_id, stock_ticker))
        conn.commit()
        return jsonify({"message": f"Stock {stock_ticker} added to watchlist!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()  
    
# Route to get watchlist tickers by user's email
@app.route('/get_watchlist', methods=['GET'])
def get_watchlist():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get user ID from email
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id = user["user_id"]

        # Get tickers from watchlist
        cursor.execute("SELECT stock_ticker FROM watchlist WHERE user_id = %s", (user_id,))
        watchlist = cursor.fetchall()
        tickers = [row["stock_ticker"] for row in watchlist]

        return jsonify({"email": email, "watchlist": tickers}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=5001)