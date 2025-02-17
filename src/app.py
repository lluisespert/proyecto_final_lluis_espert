from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'lluis'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'usuarios'

mysql = MySQL(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = hashlib.sha256(data['password'].encode()).hexdigest()

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "Login successful!", "rol": user['rol']}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)

