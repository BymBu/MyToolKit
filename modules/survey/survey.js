// modules/survey/survey.js
window.DailySurvey = {
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // HTML нового опроса
        container.innerHTML = `
            <h3 style="margin:0 0 16px; color:#247afa; font-size:1.1rem;">Викторина дня</h3>
            
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>

            <form class="ds-form">
                <fieldset>
                    <legend><strong>Какой напиток ты выбираешь утром?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="drink-coffee" name="drink" value="coffee" required>
                        <label for="drink-coffee">Кофе</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="drink-tea" name="drink" value="tea">
                        <label for="drink-tea">Чай</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="drink-juice" name="drink" value="juice">
                        <label for="drink-juice">Сок</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend><strong>Какая еда — твой идеальный ужин?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="food-pasta" name="food" value="pasta" required>
                        <label for="food-pasta">Паста</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="food-burger" name="food" value="burger">
                        <label for="food-burger">Буузы</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="food-soup" name="food" value="soup">
                        <label for="food-soup">Бухлёр</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend><strong>Любишь ли ты дождь?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="rain-love" name="rain" value="love" required>
                        <label for="rain-love">Да, он уютный</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="rain-hate" name="rain" value="hate">
                        <label for="rain-hate">Нет, только солнце!</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="rain-ok" name="rain" value="ok">
                        <label for="rain-ok">Неважно, главное — зонт</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend><strong>Какой сезон твой любимый?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="season-summer" name="season" value="summer" required>
                        <label for="season-summer">Лето</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-winter" name="season" value="winter">
                        <label for="season-winter">Зима</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-spring" name="season" value="spring">
                        <label for="season-spring">Весна</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-osen" name="season" value="osen">
                        <label for="season-osen">Осень</label>
                    </div>
                </fieldset>

                <div class="radio-option">
                    <input type="checkbox" id="agree-share" name="agree" value="yes" required>
                    <label for="agree-share">Я согласен(а) на обработку персональных данных*</label>
                </div>

                <button type="submit">Отправить ответ</button>
            </form>
        `;

        const style = document.createElement('style');
        style.textContent = `

            .progress-container {
                width: 100%;
                height: 8px;
                background-color: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 16px;
            }
            .progress-bar {
                width: 0%;
                height: 100%;
                background: #247afa;
                border-radius: 10px;
                transition: width 0.4s ease;
            }
            .ds-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
                font-size: 14px;
                flex: 1;
                overflow-y: auto;
            }
            fieldset {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 12px;
                margin: 0;
            }
            legend {
                padding: 0 6px;
                color: #3A3A3A;
                font-weight: 500;
            }
           .radio-option {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
            margin-bottom: 5px;
            }

            .radio-option:last-child {
            margin-bottom: 0;
            }
            .radio-option input[type="radio"],
            .radio-option input[type="checkbox"] {
                transform: scale(1.3);
            }
            button[type="submit"] {
                background: #247afa;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 16px;
                font-weight: 500;
            }
            button[type="submit"]:hover {
                background: #1a5edc;
            }
            .survey__like {
                position: absolute;
                top: 100px;
                right: -60px;
                pointer-events: none;
                z-index: 1;
            }
            .survey__like-img {
                width: 50px;
                opacity: 0.95;
                filter: drop-shadow(0 2px 4px rgba(36, 122, 250, 0.3));
                transition: transform 0.6s ease;
            }
        `;
        container.appendChild(style);

        // Логика прогресса
        const form = container.querySelector('.ds-form');
        const progressBar = container.querySelector('.progress-bar');

        function updateProgress() {
            const form = container.querySelector('.ds-form');

            // Находим ВСЕ уникальные name у обязательных radio/checkbox
            const requiredInputs = form.querySelectorAll('input[required]');
            const groupNames = new Set();

            requiredInputs.forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    groupNames.add(input.name);
                }
            });

            let filled = 0;
            const total = groupNames.size;

            groupNames.forEach(name => {
                const first = form.querySelector(`input[name="${name}"]`);
                if (first.type === 'radio') {
                    if (form.querySelector(`input[name="${name}"]:checked`)) filled++;
                } else if (first.type === 'checkbox') {
                    if (first.checked) filled++;
                }
            });

            const percent = Math.min((filled / total) * 100, 100);
            progressBar.style.width = `${percent}%`;
        }

        // События
        form.addEventListener('input', updateProgress);
        form.addEventListener('change', updateProgress);
        form.addEventListener('submit', e => {
            e.preventDefault();
            alert('Спасибо за участие в викторине!');
        });

        // Инициализация прогресса
        updateProgress();
    }
};