import sqlite3
from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder="templates")
print("The site is up and running!")
# Функція для отримання останнього запису з БД
def get_last_record():
    connection = sqlite3.connect('generator.db')
    cursor = connection.cursor() #helloo
    try:
        # Виконання -запиту
        cursor.execute("""
        SELECT 
        generators.temperature, 
        generators.fuleusage, 
        generators.fulelevel, 
        generators.emmision, 
        generators.timestamp,  
        names.name AS generator_name
        FROM 
            generators
        JOIN 
            names
        ON 
            generators.gen_id = names.id
        ORDER BY 
            generators.timestamp DESC
        LIMIT 1;""")
        last_record = cursor.fetchone()
        return last_record
    except sqlite3.Error as e:
        print(f"Помилка роботи з БД: {e}")
        return None
    finally:
        connection.close()

# Головна сторінка
@app.route("/")
def index():
    last_record = get_last_record()
    return render_template("index.html", record=last_record)

# Сторінка подій
@app.route("/events")
def events():
    return render_template("events.html")

@app.route("/api/last_record", methods=["GET"])
def api_last_record():
    last_record = get_last_record()  # Отримує останній запис
    if last_record:
        '''if None in last_record:  # Якщо є хоча б одне значення None, це означає, що дані неповні
            return jsonify({"error": "Incomplete data received"}), 400'''

        record = {
            "temperature": last_record[0], # Температура
            "fuel_usage": last_record[3], # Використання палива
            "fuel_level": last_record[2],  # Рівень палива
            "emission": last_record[3],  # Викиди
            "timestamp": last_record[4],  # Дата - час
            "generator_name": last_record[5],  # Назва гененератора
        }
        return jsonify(record), 200
    else:
        return jsonify({"error": "No records found"}), 404


# Запуск сервера
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
