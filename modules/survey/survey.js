// modules/survey/survey.js
window.DailySurvey = {
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // HTML нового опроса
        container.innerHTML = `
            <h3 style="margin:0 0 16px; color:#247afa; font-size:1.1rem;">Опрос дня</h3>
            
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>

            <form class="ds-form">
                <fieldset>
                    <legend><strong>Какой тип проектов тебе интереснее?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="proj-open" name="project-type" value="open" required>
                        <label for="proj-open">Open-source (открытый код)</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="proj-close" name="project-type" value="closed">
                        <label for="proj-close">Проприетарные (закрытые)</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend><strong>Что для тебя важнее в IT-проекте?</strong></legend>
                    <div class="radio-option">
                        <input type="radio" id="val-learning" name="value" value="learning" required>
                        <label for="val-learning">Обучение и рост</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="val-money" name="value" value="money">
                        <label for="val-money">Доход и коммерция</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="val-impact" name="value" value="impact">
                        <label for="val-impact">Влияние на сообщество</label>
                    </div>
                </fieldset>

<fieldset>
    <legend><strong>Участвуешь ли в open-source?</strong></legend>
    <div class="radio-option">
        <input type="radio" id="oss-yes" name="oss" value="yes" required>
        <label for="oss-yes">Да, активно</label>
    </div>
    <div class="radio-option">
        <input type="radio" id="oss-sometimes" name="oss" value="sometimes">
        <label for="oss-sometimes">Иногда</label>
    </div>
    <div class="radio-option">
        <input type="radio" id="oss-no" name="oss" value="no">
        <label for="oss-no">Пока нет, но хочу</label>
    </div>
</fieldset>


<fieldset>
    <legend><strong>Живешь в Улан-Удэ?</strong></legend>
    <div class="radio-option">
        <input type="radio" id="city-yes" name="city" value="yes" required>
        <label for="city-yes">Да</label>
    </div>
    <div class="radio-option">
        <input type="radio" id="city-sometimes" name="city" value="no">
        <label for="city-sometimes">Нет</label>
    </div>
</fieldset>



                <div class="radio-option">
                    <input type="checkbox" id="agree-share" name="agree" value="yes" required>
                    <label for="agree-share">Я согласен(а), что CrashSystem - победители*</label>
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
            alert('Спасибо за участие в опросе!');
        });

        // Инициализация прогресса
        updateProgress();
    }
};