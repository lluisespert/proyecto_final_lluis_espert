import MySQLdb

try:
    connection = MySQLdb.connect(
        host='localhost',
        user='lluis',
        password='1234',
        database='usuarios'
    )
    cursor = connection.cursor()
    cursor.execute("SELECT DATABASE()")
    db_name = cursor.fetchone()
    print(f"Connected to database: {db_name[0]}")
except MySQLdb.Error as err:
    print(f"Error: {err}")
finally:
    if 'connection' in locals() and connection:
        connection.close()
