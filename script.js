// Данные об автомобилях
const cars = [
    {
        id: 1,
        name: "Седан Премиум",
        description: "Комфортный семейный автомобиль с современным дизайном",
        price: "850 000 руб.",
        imageText: "Седан Премиум"
    },
    {
        id: 2,
        name: "Универсал Комфорт",
        description: "Просторный автомобиль для путешествий с большим багажником",
        price: "920 000 руб.",
        imageText: "Универсал Комфорт"
    },
    {
        id: 3,
        name: "Хэтчбек Стандарт",
        description: "Экономичный городской автомобиль с низким расходом топлива",
        price: "720 000 руб.",
        imageText: "Хэтчбек Стандарт"
    }
];

// Загрузка автомобилей на страницу
document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    setupForm();
});

// Загрузка автомобилей в каталог
function loadCars() {
    const carsContainer = document.getElementById('cars-container');
    
    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.className = 'car-card';
        carElement.innerHTML = `
            <div class="car-image">${car.imageText}</div>
            <div class="car-info">
                <h3>${car.name}</h3>
                <p>${car.description}</p>
                <p class="car-price">${car.price}</p>
                <button class="cta-button" onclick="showOrderForm('${car.name}')">Оставить заявку</button>
            </div>
        `;
        
        carsContainer.appendChild(carElement);
    });
}

// Настройка обработчика формы
function setupForm() {
    const form = document.getElementById('car-order-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const carModel = document.getElementById('car-model').value;
        
        try {
            // Отправка данных на сервер
            const response = await fetch('/api/application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    car_model: carModel
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(`Спасибо, ${name}! Ваша заявка на ${carModel} принята. Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
                form.reset();
            } else {
                alert('Ошибка при отправке заявки: ' + (result.error || 'Неизвестная ошибка'));
            }
        } catch (error) {
            alert('Ошибка соединения с сервером. Попробуйте позже.');
            console.error('Ошибка:', error);
        }
    });
}

// Показать форму заказа с выбранной моделью
function showOrderForm(carName) {
    document.getElementById('car-model').value = carName;
    document.querySelector('.contact-form').scrollIntoView({ behavior: 'smooth' });
}

// Показать каталог (заглушка для демонстрации)
function showCatalog() {
    alert("В полной версии сайта здесь откроется полный каталог автомобилей.");
}

// Имитация проверки наличия автомобиля (для демонстрации)
function checkAvailability(carId) {
    // В реальном приложении здесь был бы запрос к серверу
    const car = cars.find(c => c.id === carId);
    if (car) {
        alert(`Автомобиль "${car.name}" доступен для заказа!`);
        return true;
    }
    return false;
}

// Функция для тестирования связи с сервером
async function testServerConnection() {
    try {
        const response = await fetch('/api/cars');
        if (response.ok) {
            console.log('Сервер работает корректно');
        } else {
            console.warn('Сервер вернул ошибку:', response.status);
        }
    } catch (error) {
        console.error('Не удалось подключиться к серверу:', error);
    }
}
// Проверяем соединение при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // testServerConnection(); // Раскомментируйте для тестирования
});
