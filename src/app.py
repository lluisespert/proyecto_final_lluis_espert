from flask import Flask, request, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
from flask_cors import CORS
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'lluis'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'usuarios'
app.secret_key = 'tu_secreto_aqui'  # Asegúrate de tener una clave secreta configurada

mysql = MySQL(app)

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful!"}), 200

@app.route('/api/todos', methods=['GET', 'POST'])
def manage_todos():
    if request.method == 'POST':
        try:
            data = request.json
            label = data['label']
            description = data.get('description', '')
            is_done = data.get('is_done', False)
            user_id = data.get('user_id', None)
            assigned_at = datetime.now(timezone.utc)

            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute('INSERT INTO todos (label, description, is_done, user_id, assigned_at) VALUES (%s, %s, %s, %s, %s)', (label, description, is_done, user_id, assigned_at))
            mysql.connection.commit()

            new_todo_id = cursor.lastrowid
            cursor.execute('''
                SELECT todos.id, todos.label, todos.description, todos.is_done, todos.assigned_at, todos.completed_at, users.username AS assigned_user 
                FROM todos 
                LEFT JOIN users ON todos.user_id = users.id
                WHERE todos.id = %s
            ''', (new_todo_id,))
            new_todo = cursor.fetchone()

            return jsonify(new_todo), 201
        except Exception as e:
            print("Error al insertar datos:", e)
            return jsonify({"error": "Error al insertar datos"}), 500
    elif request.method == 'GET':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('''
            SELECT todos.id, todos.label, todos.description, todos.is_done, todos.assigned_at, todos.completed_at, users.username AS assigned_user 
            FROM todos 
            LEFT JOIN users ON todos.user_id = users.id
        ''')
        todos = cursor.fetchall()
        return jsonify(todos)

@app.route('/api/todos/<int:id>', methods=['PUT', 'DELETE'])
def modify_todo(id):
    if request.method == 'PUT':
        data = request.json
        label = data['label']
        description = data['description']
        is_done = data['is_done']
        completed_at = datetime.now(timezone.utc) if is_done else None
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('UPDATE todos SET label = %s, description = %s, is_done = %s, completed_at = %s WHERE id = %s', (label, description, is_done, completed_at, id))
        mysql.connection.commit()
        
        cursor.execute('''
            SELECT todos.id, todos.label, todos.description, todos.is_done, todos.assigned_at, todos.completed_at, users.username AS assigned_user 
            FROM todos 
            LEFT JOIN users ON todos.user_id = users.id
            WHERE todos.id = %s
        ''', (id,))
        updated_todo = cursor.fetchone()
        
        return jsonify(updated_todo)
    
    elif request.method == 'DELETE':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('DELETE FROM todos WHERE id = %s', (id,))
        mysql.connection.commit()
        
        return '', 204

@app.route('/api/users', methods=['GET'])
def get_users():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT id, username FROM users WHERE rol = %s', ('user',))
    users = cursor.fetchall()
    return jsonify(users)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = hashlib.sha256(data['password'].encode()).hexdigest()

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
    user = cursor.fetchone()

    if user:
        session['user_id'] = user['id']
        return jsonify({"message": "Login successful!", "username": user['username'], "rol": user['rol']}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/dashboard')
def dashboard():
    if 'user_id' in session:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE id = %s', (session['user_id'],))
        user = cursor.fetchone()

        if user:
            return jsonify({"username": user['username'], "rol": user['rol']})
        else:
            return redirect(url_for('login'))
    else:
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)