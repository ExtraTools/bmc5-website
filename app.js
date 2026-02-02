// BMC5 Website Logic
// Server: faq-sodium.gl.joinmc.link

const SERVER_ADDRESS = 'faq-sodium.gl.joinmc.link';
const SERVER_PORT = 25565;

// API для проверки статуса MC сервера
const STATUS_API = `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}:${SERVER_PORT}`;

// Обновление статуса сервера
async function updateServerStatus() {
    const badge = document.getElementById('server-status-badge');
    const playerCount = document.getElementById('player-count');
    const statusDot = document.querySelector('.status-dot');

    try {
        const response = await fetch(STATUS_API);
        const data = await response.json();

        if (data.online) {
            // Сервер онлайн
            badge.classList.remove('offline');
            badge.classList.add('online');
            statusDot.style.background = 'var(--mc-green)';
            statusDot.style.boxShadow = '0 0 10px var(--mc-green)';

            const online = data.players?.online || 0;
            const max = data.players?.max || 20;
            playerCount.textContent = `${online}/${max} онлайн`;
        } else {
            // Сервер оффлайн
            setOfflineStatus();
        }
    } catch (error) {
        console.error('Ошибка проверки статуса:', error);
        setOfflineStatus();
    }
}

function setOfflineStatus() {
    const badge = document.getElementById('server-status-badge');
    const playerCount = document.getElementById('player-count');
    const statusDot = document.querySelector('.status-dot');

    badge.classList.remove('online');
    badge.classList.add('offline');
    statusDot.style.background = '#ff4444';
    statusDot.style.boxShadow = '0 0 10px #ff4444';
    playerCount.textContent = 'Сервер оффлайн';
}

// Копирование IP адреса
function copyIP() {
    const ip = SERVER_ADDRESS;
    navigator.clipboard.writeText(ip).then(() => {
        const tooltip = document.getElementById('ip-tooltip');
        tooltip.innerHTML = `IP скопирован: ${ip}`;
        tooltip.style.opacity = '1';
        setTimeout(() => {
            tooltip.style.opacity = '0';
        }, 2000);
    }).catch(err => {
        console.error('Не удалось скопировать:', err);
        // Fallback для старых браузеров
        prompt('Скопируйте IP:', ip);
    });
}

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Map Toggler (placeholder)
document.querySelector('.toggle-map-btn')?.addEventListener('click', () => {
    alert('Карта будет доступна после установки BlueMap на сервер!');
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем статус сразу
    updateServerStatus();

    // Обновляем каждые 30 секунд
    setInterval(updateServerStatus, 30000);
});
