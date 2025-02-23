from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Connect to MySQL Database
conn = mysql.connector.connect(
    host="localhost",      # e.g., 'localhost' or an IP
    user="root",
    password="",
    database="finance_app"
)

# Route to add a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    email = data.get("email")
    password_hash = data.get("password")  # In a real app, hash passwords before storing!

    if not email or not password_hash:
        return jsonify({"error": "Email and password are required"}), 400

    conn = mysql.connector.connect()
    cursor = conn.cursor()
    
    try:
        sql = "INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (%s, %s, %s, '', '')"
        cursor.execute(sql, (email, email, password_hash))
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

    conn = mysql.connector.connect()
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

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)


cursor = conn.cursor()

# Example query to fetch all users
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

for user in users:
    print(user)

# Close connection
cursor.close()
conn.close()

