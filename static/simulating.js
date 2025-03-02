function monitorSystem() {
    const categories = ["temperature", "fuel", "emissions", "performance"];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const now = new Date();
    const timestamp = now.toLocaleDateString('uk-UA') + ' ' + now.toLocaleTimeString('uk-UA');

    switch (selectedCategory) {
        case "temperature":
            simulateTemperature(timestamp);
            break;

        case "fuel":
            simulateFuelLevel(timestamp);
            break;

        case "emissions":
            simulateEmissions(timestamp);
            break;

        case "performance":
            simulatePerformance(timestamp);
            break;
    }
}

function simulateTemperature(timestamp) {
    const temperature = Math.floor(Math.random() * 120);

    if (temperature > 90) {
        addEvent("critical", `Критично висока температура - ${temperature}°C`, timestamp);
    } else if (temperature > 80) {
        addEvent("warning", `Висока температура - ${temperature}°C`, timestamp);
    }
}

function simulateFuelLevel(timestamp) {
    const fuelLevel = Math.floor(Math.random() * 100);

    if (fuelLevel < 30) {
        if (fuelLevel < 10) {
            addEvent("critical", `Критично низький рівень палива - ${fuelLevel}%`, timestamp);
        } else {
            addEvent("warning", `Низький рівень палива - ${fuelLevel}%`, timestamp);
        }
    }
}

function simulateEmissions(timestamp) {
    const emissions = Math.floor(Math.random() * 200); // Викиди в умовних одиницях

    if (emissions > 150) {
        addEvent("critical", `Критично високі викиди - ${emissions} одиниць`, timestamp);
    } else if (emissions > 100) {
        addEvent("warning", `Високі викиди - ${emissions} одиниць`, timestamp);
    }
}

function simulatePerformance(timestamp) {
    const performance = Math.floor(Math.random() * 100); // Продуктивність у %

    if (performance < 50) {
        if (performance < 20) {
            addEvent("critical", `Критично низька продуктивність - ${performance}%`, timestamp);
        } else {
            addEvent("warning", `Низька продуктивність - ${performance}%`, timestamp);
        }
    }
}

// Функція для додавання події
function addEvent(level, message, timestamp) {
    const eventList = document.getElementById("eventList");
    if (!eventList) {
        console.error("Елемент #eventList не знайдено!");
        return;
    }

    // Створюємо елемент списку
    const listItem = document.createElement("li");
    listItem.className = `event-item ${level}`;

    // Іконка
    const icon = document.createElement("span");
    icon.className = `icon ${level}`;
    icon.innerHTML = getIconHTML(level); // Додаємо HTML-код іконки

    // Повідомлення
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    // Часова мітка
    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = timestamp;

    // Збираємо елементи разом
    listItem.appendChild(icon);
    listItem.appendChild(messageSpan);
    listItem.appendChild(timestampSpan);

    // Додаємо до списку
    eventList.appendChild(listItem);
}

// Повертає HTML-код іконки залежно від рівня події
function getIconHTML(level) {
    switch (level) {
        case "critical":
            return "&#9888;"; // ⚠️
        case "warning":
            return "&#x26A0;"; // ⚠
        case "info":
            return "&#9432;"; // ℹ
        default:
            return "";
    }
}

// Запускаємо симуляцію кожні 5 секунд
setInterval(monitorSystem, 5000);
