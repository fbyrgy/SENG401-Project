from flask import Flask, request, jsonify
from flask_cors import CORS
from connection import get_db_connection
import mysql.connector
import bcrypt

app = Flask(__name__)
CORS(app)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get the hashed password from the database
        sql = "SELECT password_hash FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()

        if result:
            hashed_password = result[0]

            # Compare the entered password with the stored hashed password
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                return jsonify({"message": "Login successful"}), 200
            else:
                return jsonify({"error": "Invalid credentials"}), 401
        else:
            return jsonify({"error": "User not found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(port=5002)
