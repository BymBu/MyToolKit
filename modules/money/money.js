// modules/fluctuating/fluctuating.js
window.Fluctuating = {
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const oldStyle = document.getElementById('fluctuating-styles');
        if (oldStyle) oldStyle.remove();

        const style = document.createElement('style');
        style.id = 'fluctuating-styles';
        style.textContent = `
            .fluctuating-module {
                width: 100%;
                height: 100%;
                background: #fff;
                border-radius: 16px;

                font-family: 'Montserrat', sans-serif;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 20px;
                color: #3A3A3A;
            }

            .fluctuating-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #247afa;
                text-align: center;
                margin: 0 0 10px 0;
            }

            .currency-row {
                display: flex;
                gap: 12px;
                width: 100%;
            }

            .currency-cube {
                flex: 1;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 16px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 120px;
                transition: background 0.2s;
            }

            .currency-cube:hover {
                background: #e9ecef;
            }

            .currency-symbol {
                font-size: 1rem;
                margin-bottom: 4px;
            }

            .currency-name {
                font-size: 0.75rem;
                font-weight: 600;
                color: #247afa;
                margin-bottom: 6px;
            }

            .currency-rate {
                font-size: 0.75rem;
                font-weight: 500;
                color: #333;
                line-height: 1.4;
            }

            .currency-rate.loading {
                color: #6c757d;
                font-style: italic;
            }

            /* === КАЛЬКУЛЯТОР === */
            .calculator {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .calculator-display {
                width: 100%;
                height: 50px;
                font-size: 1.3rem;
                font-weight: 600;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                border: 1px solid #dee2e6;
                border-radius: 12px;
                background: white;
                color: #1e293b;
                outline: none;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
            }

            .calculator-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
            }

            .calc-btn {
                height: 50px;
                font-family: 'Montserrat', sans-serif;
                font-size: 1rem;
                font-weight: 500;
                border: none;
                border-radius: 10px;
                background: #f8f9fa;
                color: #1e293b;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }

            .calc-btn:hover {
                background: #e9ecef;
                transform: translateY(-1px);
            }

            .calc-btn:active {
                transform: translateY(0);
            }

            .calc-btn.operator {
                background: #dbeafe;
                color: #247afa;
            }

            .calc-btn.operator:hover {
                background: #bfdbfe;
            }

            .calc-btn.equals {
                background: #247afa;
                color: white;
            }

            .calc-btn.equals:hover {
                background: #1a62d0;
            }

            .calc-btn.clear {
                background: #f87171;
                color: white;
            }

            .calc-btn.clear:hover {
                background: #ef4444;
            }
        `;
        document.head.appendChild(style);

        // HTML разметка
        container.innerHTML = `
            <div class="fluctuating-module">

                <!-- Блоки с курсами -->
                <div class="currency-row">
                    <div class="currency-cube">
                        <div class="currency-symbol">₽</div>
                        <div class="currency-name">RUB</div>
                        <div class="currency-rate">1 RUB = 1 RUB</div>
                    </div>
                    <div class="currency-cube" id="cube-usd">
                        <div class="currency-symbol">$</div>
                        <div class="currency-name">USD</div>
                        <div class="currency-rate loading">Загрузка...</div>
                    </div>
                    <div class="currency-cube" id="cube-eur">
                        <div class="currency-symbol">€</div>
                        <div class="currency-name">EUR</div>
                        <div class="currency-rate loading">Загрузка...</div>
                    </div>
                </div>

                <!-- Калькулятор -->
                <div class="calculator">
                    <input type="text" class="calculator-display" id="calc-display" value="0" disabled>
                    <div class="calculator-buttons">
                        <button class="calc-btn clear" data-value="C">C</button>
                        <button class="calc-btn" data-value="(">(</button>
                        <button class="calc-btn" data-value=")">)</button>
                        <button class="calc-btn operator" data-value="/">/</button>

                        <button class="calc-btn" data-value="7">7</button>
                        <button class="calc-btn" data-value="8">8</button>
                        <button class="calc-btn" data-value="9">9</button>
                        <button class="calc-btn operator" data-value="*">*</button>

                        <button class="calc-btn" data-value="4">4</button>
                        <button class="calc-btn" data-value="5">5</button>
                        <button class="calc-btn" data-value="6">6</button>
                        <button class="calc-btn operator" data-value="-">-</button>

                        <button class="calc-btn" data-value="1">1</button>
                        <button class="calc-btn" data-value="2">2</button>
                        <button class="calc-btn" data-value="3">3</button>
                        <button class="calc-btn operator" data-value="+">+</button>

                        <button class="calc-btn" data-value=".">.</button>
                        <button class="calc-btn" data-value="0">0</button>
                        <button class="calc-btn" data-value="←">&larr;</button>
                        <button class="calc-btn equals" data-value="=">=</button>
                    </div>
                </div>
            </div>
        `;

        // =============== КАЛЬКУЛЯТОР ===============
        const display = document.getElementById('calc-display');

        const handleInput = (value) => {
            if (value === 'C') {
                display.value = '0';
            } else if (value === '=') {
                try {
                    let expr = display.value.replace(/\s+/g, '');
                    if (!expr || expr === '0') return;

                    expr = expr.replace(/[+\-*/]+$/, ''); // Убираем последний оператор
                    if (!expr) return;

                    let result = Function('"use strict"; return (' + expr + ')')();
                    if (typeof result === 'number' && isFinite(result)) {
                        display.value = parseFloat(result.toFixed(10)).toString();
                    } else {
                        display.value = 'Ошибка';
                    }
                } catch (e) {
                    display.value = 'Ошибка';
                }
            } else if (value === '←') {
                if (display.value.length > 1) {
                    display.value = display.value.slice(0, -1);
                } else {
                    display.value = '0';
                }
            } else {
                if (display.value === '0' || display.value === 'Ошибка') {
                    display.value = value;
                } else {
                    display.value += value;
                }
            }
        };

        // Обработчики кликов
        container.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                handleInput(btn.dataset.value);
            });
        });

        // =============== КУРСЫ ВАЛЮТ ===============
        const cubeUSD = document.getElementById('cube-usd');
        const cubeEUR = document.getElementById('cube-eur');

        const updateCube = (cube, rateText, isLoading = false) => {
            const rateEl = cube.querySelector('.currency-rate');
            rateEl.textContent = rateText;
            rateEl.className = isLoading ? 'currency-rate loading' : 'currency-rate';
        };

        const fetchRates = async () => {
            updateCube(cubeUSD, 'Загрузка...', true);
            updateCube(cubeEUR, 'Загрузка...', true);

            try {
                const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
                if (!response.ok) throw new Error('Ошибка загрузки');

                const data = await response.json();

                if (data.Valute?.USD) {
                    const rate = (data.Valute.USD.Value / data.Valute.USD.Nominal).toFixed(4);
                    updateCube(cubeUSD, `1 USD = ${rate} ₽`);
                } else {
                    updateCube(cubeUSD, '—');
                }

                if (data.Valute?.EUR) {
                    const rate = (data.Valute.EUR.Value / data.Valute.EUR.Nominal).toFixed(4);
                    updateCube(cubeEUR, `1 EUR = ${rate} ₽`);
                } else {
                    updateCube(cubeEUR, '—');
                }
            } catch (err) {
                console.error('Ошибка получения курсов:', err);
                updateCube(cubeUSD, 'Нет данных');
                updateCube(cubeEUR, 'Нет данных');
            }
        };

        // Загружаем курсы при старте
        fetchRates();
    }
};