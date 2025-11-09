document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-left__element");
    const pages = document.querySelectorAll(".page");

    function showPage(pageId) {
        // Скрываем все страницы
        pages.forEach(page => page.classList.add("hidden"));

        // Показываем нужную
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.remove("hidden");
        }

        // какая страница открыта
        if (pageId === 'management-page') {
            // Загружаем модули только один раз
            if (!window.managementModulesLoaded) {
                loadManagementModules();
                window.managementModulesLoaded = true;
            }
        }
    }

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            menuItems.forEach(el => el.classList.remove("btn-active"));
            this.classList.add("btn-active");

            const pageName = this.getAttribute("data-page") + "-page";
            showPage(pageName);
        });
    });


    // Показываем главную при загрузке
    showPage("home-page");
});


// Цитата на главном меню

const citateText = document.querySelector('.citate__text');
const text = [
    "❝ Обязательно дружите с теми, кто лучше вас. Будете мучиться, но расти.❞",
    '❝ Жизнь состоит не в том, чтобы найти себя. Жизнь состоит в том, чтобы создать себя. ❞',
    '❝ Будьте заняты. Это самое дешевое лекарство на земле — и одно из самых эффективных. ❞',
    '❝ Когда игра заканчивается, король и пешка падают в одну и ту же коробку. ❞',
    '❝ Хороший код — не тот, что блестит. Хороший код — тот, который завтра поймёт даже ты после трёх пива. ❞',
    '❝ Прогнозы строят для слабых. Сильные просто делают и переживают последствия. ❞',
    '❝ Умный работает в команде. Гениальный — один. Но легендарный знает, когда надо замолчать и помочь. ❞',
    '❝ Не ошибка — самое страшное в работе. Страшно — ничего не делать, потому что боишься ошибиться. ❞',
    '❝ Ты не медленнее других. Ты просто слишком долго смотришь в пустой файл. Начни хоть с мусора — потом отредактируешь. ❞',
    '❝ Интерфейс должен служить человеку, а не заставлять его учить инструкцию. ❞',
    '❝ Лучший способ предсказать будущее — выбросить прогноз и сделать самому. ❞'
];

let line = 0;
let count = 0;
let result = '';
let isDeleting = false;

function typeLine() {
    const currentText = text[line];
    let speed = isDeleting ? getRandomInt(10, 1) : getRandomInt(30, 1); 

    if (!isDeleting) {
        result = currentText.substring(0, count + 1);
        count++;
        if (count === currentText.length) {
            isDeleting = true;
            speed = 4500; 
        }
    } else {
        result = currentText.substring(0, count - 1);
        count--;
        if (count === 0) {
            isDeleting = false;
            line = (line + 1) % text.length; 
            speed = 500;
        }
    }

    citateText.innerHTML = result + '<span style="opacity:0.8;">|</span>';

    setTimeout(typeLine, speed);
}


function getRandomInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

typeLine();




// дата

const now = new Date();
const hours = now.getHours();
const iconImg = document.querySelector('.main__icon');
const mainTitle = document.querySelector('.main-info__title');

let greeting;
let iconSrc;

if (hours >= 6 && hours < 12) {
    greeting = 'Доброе утро, CrashSystem';
    iconSrc = './img/ico/sun.svg';
} else if (hours >= 12 && hours < 18) {
    greeting = 'Добрый день, CrashSystem';
    iconSrc = './img/ico/sun.svg';
} else {
    greeting = 'Добрый вечер, CrashSystem';
    iconSrc = './img/ico/moon.svg';
}

iconImg.src = iconSrc;
mainTitle.textContent = greeting;


let time = setInterval(function () {
    let date = new Date();

    const formattedDate = date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');


    const displayTime = `${formattedDate} ${hours}:${minutes}:${seconds}`;

    document.querySelector('.management__date-text').textContent = displayTime;
}, 1000);