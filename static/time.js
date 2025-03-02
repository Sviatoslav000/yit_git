function updateTime() {
    const timestampElement = document.getElementById('timestamp');
    const now = new Date();
    timestampElement.textContent = now.toLocaleString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

// Оновлення кожну секунду
setInterval(updateTime, 1000);
updateTime();
