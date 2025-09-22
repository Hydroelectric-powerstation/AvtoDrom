// Данные об автомобилях
const cars = [
    {
        id: 1,
        name: "Джипик жесткее",
        description: "Некомфортный семейный автомобиль со старым дизайном",
        price: "8500руб.",
        imageText: "Джипик"
    },
    {
        id: 2,
        name: "бибика полицаев",
        description: "Просторный автомобиль для путешествий с большим багажником",
        price: "деняг много.",
        imageText: "🚓"
    },
    {
        id: 3,
        name: "Асулбек",
        description: "Экономичный городской автомобиль с высоким расходом топлива",
        price: "∞ руб.",
        imageText: "Асулбек Стандарт"
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
            alert('Ошибка соединения с сервером. Попробуйте позже.АХАХХХАХАХ ЛОХ, А ПРИ ТЕСТЕ ВСЕ ОК БЫЛОО');
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
    alert("Тут нет и не будет полного католога😍😍😮");
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
// Обработка формы отзывов
function setupReviewForm() {
    const form = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 5;
    
    // Выбор рейтинга
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            
            // Обновляем отображение звезд
            stars.forEach(s => {
                const value = parseInt(s.getAttribute('data-value'));
                if (value <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Изначально активируем 5 звезд
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= selectedRating) {
            star.classList.add('active');
        }
    });
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('review-name').value;
        const text = document.getElementById('review-text').value;
        
        if (name && text) {
            alert('Спасибо за ваш отзыв! После модерации он появится на сайте.');
            form.reset();
            
            // Сброс рейтинга
            stars.forEach(star => star.classList.remove('active'));
            selectedRating = 5;
            stars[0].classList.add('active');
        }
    });
}

// Добавьте вызов функции в обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    setupForm();
    setupReviewForm(); // Добавьте эту строку
});
