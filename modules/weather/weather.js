// modules/weather/weather.js
window.Weather = {
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // HTML
        container.innerHTML = `
            <div class="weather-wrapper">
                <!-- Декоративное облачко -->
                <div class="weather-cloud"></div>

                <!-- Основной блок -->
                <div class="weather-card">
                    <div class="weather-location">
                        📍 <span class="location-text">Определяем...</span>
                    </div>

                    <div class="weather-time">
                        <span class="time-text">— — —, —:—</span>
                    </div>

                    <div class="weather-main">
                        <div class="temp-display">--°</div>
                        <div class="icon-and-condition">
                            <img src="./modules/weather/img/weather.png" alt="Погода" class="weather-icon">
                            <div class="condition-text">Загрузка</div>
                        </div>
                    </div>

                    <div class="weather-stats">
                        <div class="stat">
                            <img src="./modules/weather/img/mini_logo/Vector1.png" alt="Осадки" class="stat-icon">
                            <span class="precipitation">-- мм</span>
                            <small>Осадки</small>
                        </div>
                        <div class="stat">
                            <img src="./modules/weather/img/mini_logo/Vector3.png" alt="Влажность" class="stat-icon">
                            <span class="humidity">--%</span>
                            <small>Влажность</small>
                        </div>
                        <div class="stat">
                            <img src="./modules/weather/img/mini_logo/Vector2.png" alt="Ветер" class="stat-icon">
                            <span class="wind">-- м/с</span>
                            <small>Ветер</small>
                        </div>
                    </div>

                    <div class="forecast">
                        <strong>Сегодня</strong>
                        <div class="forecast-cards"></div>
                    </div>
                </div>
            </div>
        `;

        // === СТИЛИ ===
        const style = document.createElement('style');
        style.textContent = `
            .module-title {
                margin: 0 0 16px;
                color: #247afa;
                font-size: 1.3rem;
                font-weight: 600;
                position: relative;
                z-index: 2;
            }

            .weather-wrapper {
                position: relative;
                height: calc(100% - 50px);
                overflow: hidden;
                border-radius: 16px;
            }

            /* Фон с градиентом */
            .weather-wrapper::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #a0d8f1 0%, #73b9e8 25%, #4397db 50%, #247afa 100%);
                background-size: 400% 400%;
                animation: gradientShift 8s ease infinite;
                z-index: 0;
                border-radius: 16px;
                filter: blur(1px);
            }

            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .weather-card {
                position: relative;
                z-index: 1;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 20px;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                color: #fff;
                overflow: hidden;
            }

            /* Облачко */
            .weather-cloud {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 80px;
                height: 50px;
                background: url('./modules/weather/img/cloud.png') no-repeat center;
                background-size: contain;
                opacity: 0.8;
                transform: rotate(-15deg) scale(1.1);
                z-index: 1;
                filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
                animation: float 6s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: rotate(-15deg) scale(1.1) translateY(0); }
                50% { transform: rotate(-18deg) scale(1.15) translateY(-8px); }
            }

            .weather-location,
            .weather-time,
            .condition-text {
                color: white;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .weather-location {
                font-size: 1rem;
            }

            .time-text {
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .weather-main {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-top: 10px;
            }

            .temp-display {
                font-size: 3rem;
                font-weight: 700;
                color: white;
                text-shadow: 0 2px 4px rgba(0,0,0,0.4);
            }

            .icon-and-condition {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .weather-icon {
                width: 60px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }

            .condition-text {
                font-size: 1.1rem;
                font-weight: 500;
            }

            .weather-stats {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255, 255, 255, 0.25);
                padding: 10px 12px;
                border-radius: 12px;
                font-size: 0.9rem;
                min-width: 80px;
            }

            .stat-icon {
                width: 20px;
                filter: brightness(1.5);
            }

            .forecast {
                flex: 1;
                overflow-y: auto;
            }

            .forecast > strong {
                display: block;
                margin-bottom: 12px;
                font-size: 1.1rem;
                color: white;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .forecast-cards {
                display: flex;
                gap: 12px;
            }

            .forecast-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255, 255, 255, 0.2);
                padding: 10px;
                border-radius: 12px;
                min-width: 60px;
            }

            .forecast-time {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .forecast-icon {
                width: 30px;
                margin: 4px 0;
                filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.2));
            }

            .forecast-temp {
                font-weight: 600;
                color: white;
            }

            /* Скроллбар */
            .forecast-cards,
            .weather-card {
                scrollbar-width: thin;
            }
            .forecast-cards::-webkit-scrollbar,
            .weather-card::-webkit-scrollbar {
                height: 6px;
                width: 6px;
            }
            .forecast-cards::-webkit-scrollbar-track,
            .weather-card::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
            }
            .forecast-cards::-webkit-scrollbar-thumb,
            .weather-card::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
            }
        `;
        container.appendChild(style);

        // === ЛОГИКА ПОГОДЫ ===
        const locationText = container.querySelector('.location-text');
        const timeEl = container.querySelector('.time-text');
        const tempEl = container.querySelector('.temp-display');
        const conditionEl = container.querySelector('.condition-text');
        const precipitationEl = container.querySelector('.precipitation');
        const humidityEl = container.querySelector('.humidity');
        const windEl = container.querySelector('.wind');
        const forecastCards = container.querySelector('.forecast-cards');

        async function updateUI() {
            try {
                const loc = await getUserLocation();
                const weather = await getWeather(loc.latitude, loc.longitude);


                const city = await getCity(loc.latitude, loc.longitude)
                locationText.textContent = city;
                timeEl.textContent = new Date(weather.current.time).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                tempEl.textContent = Math.round(weather.current.temperature_2m) + '°';
                conditionEl.textContent = getCondition(weather.current.weather_code);
                precipitationEl.textContent = weather.current.precipitation + ' мм';
                humidityEl.textContent = weather.current.relative_humidity_2m + '%';
                windEl.textContent = Math.round(weather.current.wind_speed_10m) + ' м/с';

                // Прогноз на 4 часа
                forecastCards.innerHTML = '';
                const now = new Date(weather.current.time);
                const h = now.getHours();
                const idx = weather.hourly.time.indexOf(now.toISOString().slice(0, 14) + "00");

                for (let i = 1; i <= 4; i++) {
                    const temp = Math.round(weather.hourly.temperature_2m[idx + i]);
                    const time = `${(h + i) % 24}:00`;

                    const item = document.createElement('div');
                    item.className = 'forecast-item';
                    item.innerHTML = `
                        <span class="forecast-time">${time}</span>
                        <img src="./modules/weather/img/mini_logo/sun.png" alt="Погода" class="forecast-icon">
                        <span class="forecast-temp">${temp}°</span>
                    `;
                    forecastCards.appendChild(item);
                }

            } catch (err) {
                conditionEl.textContent = 'Нет данных';
            }
        }

        // --- Вспомогательные ---
        function getUserLocation() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject();
                navigator.geolocation.getCurrentPosition(p => resolve(p.coords), reject);
            });
        }

        async function getWeather(lat, lon) {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m&timezone=auto`;
            const r = await fetch(url);
            if (!r.ok) throw new Error();
            return r.json();
        }

        function getCondition(code) {
            const m = {
                0: "Ясно", 1: "Облачно", 2: "Переменная облачность",
                3: "Пасмурно", 45: "Туман", 51: "Морось", 61: "Дождь",
                71: "Снег", 95: "Гроза"
            };
            return m[code] || "Данные";
        }

        async function getCity(lat, lon) {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=json`;
            try {
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'MyToolKitApp/1.0'
                    }
                });
                const data = await response.json();
                return data.address.city || data.address.town || data.address.village || "Неизвестно";
            } catch (error) {
                console.error("Ошибка определения города:", error);
                return "Неизвестно";
            }
        }

        updateUI();
    }
};