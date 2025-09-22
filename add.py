from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# Загрузка данных об автомобилях
def load_cars():
    try:
        with open('cars.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # Возвращаем данные по умолчанию, если файл не найден
        return [
            {
                "id": 1,
                "name": "Седан Премиум",
                "description": "Комфортный семейный автомобиль с современным дизайном",
                "price": "850 000 руб.",
                "available": True
            },
            {
                "id": 2,
                "name": "Универсал Комфорт",
                "description": "Просторный автомобиль для путешествий с большим багажником",
                "price": "920 000 руб.",
                "available": True
            },
            {
                "id": 3,
                "name": "Хэтчбек Стандарт",
                "description": "Экономичный городской автомобиль с низким расходом топлива",
                "price": "720 000 руб.",
                "available": True
            }
        ]

# Сохранение заявок
def save_application(data):
    try:
        # Создаем папку если не существует
        os.makedirs('data', exist_ok=True)
        
        # Проверяем существует ли файл
        file_path = 'data/applications.json'
        if not os.path.exists(file_path):
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write('[]')
        
        # Читаем существующие заявки
        with open(file_path, 'r', encoding='utf-8') as f:
            applications = json.load(f)
        
        # Добавляем новую заявку
        applications.append(data)
        
        # Сохраняем обратно
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(applications, f, ensure_ascii=False, indent=2)
            
        return True
    except Exception as e:
        print(f"Ошибка при сохранении заявки: {e}")
        return False

@app.route('/')
def index():
    cars = load_cars()
    return render_template('index.html', cars=cars)

@app.route('/api/cars', methods=['GET'])
def get_cars():
    cars = load_cars()
    return jsonify(cars)

@app.route('/api/check_availability/<int:car_id>', methods=['GET'])
def check_availability(car_id):
    cars = load_cars()
    car = next((car for car in cars if car['id'] == car_id), None)
    
    if car:
        return jsonify({
            'available': car.get('available', False),
            'car_name': car['name']
        })
    else:
        return jsonify({'error': 'Автомобиль не найден'}), 404

@app.route('/api/application', methods=['POST'])
def create_application():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'phone' not in data:
            return jsonify({'error': 'Необходимо указать имя и телефон'}), 400
        
        # Сохраняем заявку
        application = {
            'name': data['name'],
            'phone': data['phone'],
            'car_model': data.get('car_model', 'Не указана'),
            'timestamp': datetime.now().isoformat()
        }
        
        if save_application(application):
            return jsonify({'success': True, 'message': 'Заявка успешно отправлена'})
        else:
            return jsonify({'error': 'Ошибка при сохранении заявки'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500

if __name__ == '__main__':
    # Создаем папку для шаблонов если не существует
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True)
    # Добавьте эту функцию для работы с отзывами
def load_reviews():
    try:
        with open('data/reviews.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_review(review):
    try:
        os.makedirs('data', exist_ok=True)
        reviews = load_reviews()
        reviews.append(review)
        
        with open('data/reviews.json', 'w', encoding='utf-8') as f:
            json.dump(reviews, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Ошибка при сохранении отзыва: {e}")
        return False

# Добавьте этот маршрут для отзывов
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = load_reviews()
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'text' not in data:
            return jsonify({'error': 'Необходимо указать имя и текст отзыва'}), 400
        
        review = {
            'name': data['name'],
            'text': data['text'],
            'rating': data.get('rating', 5),
            'timestamp': datetime.now().isoformat(),
            'approved': True  # Все отзывы автоматически одобряются
        }
        
        if save_review(review):
            return jsonify({'success': True, 'message': 'Отзыв успешно добавлен'})
        else:
            return jsonify({'error': 'Ошибка при сохранении отзыва'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500
