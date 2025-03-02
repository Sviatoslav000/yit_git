// Елементи для оновлення
const updateTimestampContainer = document.createElement('p'); // Елемент для часу оновлення
updateTimestampContainer.style.textAlign = 'center';
updateTimestampContainer.style.marginTop = '10px';
updateTimestampContainer.style.color = '#a8dadc';
document.querySelector('h1').after(updateTimestampContainer); // Додаємо під заголовок

const dashboardItems = document.querySelectorAll('.dashboard-item p');

// Функція для отримання останнього запису з сервера
async function fetchLatestData() {
    try {
        // Викликаємо API для отримання останніх даних
        const response = await fetch('/api/last_record');
        if (!response.ok) {
            throw new Error("Не вдалося отримати дані");
        }

        const data = await response.json();

        // Перевірка на помилку в даних
        if (data.error) {
            console.error(data.error);
            updateTimestampContainer.textContent = "Помилка: Дані не знайдені.";
            return;
        }

        // Оновлення часу останнього оновлення
        const now = new Date();
        const formattedTime = now.toLocaleString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        updateTimestampContainer.textContent = `Останнє оновлення: ${formattedTime}`;

        // Оновлення даних у панелі
        if (dashboardItems.length >= 4) {
            dashboardItems[0].innerHTML = `${data.temperature}<span class="unit">°C</span>`;
            dashboardItems[1].innerHTML = `${data.fuel_level}<span class="unit">л</span>`;
            dashboardItems[2].innerHTML = `${data.emission}<span class="unit">мкг/м3</span>`;
            dashboardItems[3].innerHTML = `${data.fuel_usage}<span class="unit"> л/г</span>`;
        }
    } catch (error) {
        console.error("Помилка під час отримання даних:", error);
        updateTimestampContainer.textContent = "Помилка: Неможливо отримати дані.";
    }
}

// Функція автоматичного оновлення
function startAutoUpdate(interval = 5000) {
    fetchLatestData(); // Початкове завантаження
    setInterval(fetchLatestData, interval); // Оновлення кожні 5 секунд
}

// Запускаємо оновлення при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    startAutoUpdate();
});
