// modules/planner/planner.js
window.Planner = {
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // HTML планировщика
        container.innerHTML = `
            <h3 class="module-title">Планировщик</h3>
            <div class="planner-container">
                <div class="planner-add">
                    <input type="text" class="planner-input" placeholder="Добавить задачу...">
                    <button class="planner-btn">+</button>
                </div>
                <div class="planner-list"></div>
            </div>
        `;

        // Стили (встраиваются в контейнер)
const style = document.createElement('style');
style.textContent = `
        .planner-list::-webkit-scrollbar {
    width: 6px;
}

.planner-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.planner-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.planner-list::-webkit-scrollbar-thumb:hover {
    background: #bbb;
}

    .module-title {
        margin: 0 0 16px;
        color: #247afa;
        font-size: 1.3rem;
        font-weight: 600;
    }

    .planner-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;        
        overflow: hidden;    
    }

    .planner-add {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }

    .planner-input {
        flex: 1;
        padding: 10px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        outline: none;
        font-size: 14px;
    }

    .planner-input:focus {
        border-color: #247afa;
        box-shadow: 0 0 0 4px rgba(36, 122, 250, 0.15);
    }

    .planner-btn {
        padding: 10px 16px;
        background: #247afa;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: background 0.2s;
    }

    .planner-btn:hover {
        background: #1a5edc;
    }

    /* Основной список задач — тут должен быть скролл */
    .planner-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 4px;

        /* Ключевое: не даём вырастать больше контейнера */
        max-height: 100%;
    }

    /* Стилизация задач */
    .planner-task {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .planner-task:hover {
        background: #e9ecef;
        border-color: #adb5bd;
    }

    .planner-task.completed {
        opacity: 0.6;
        text-decoration: line-through;
        color: #6c757d;
    }

    .task-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }

    .task-checkbox {
        width: 18px;
        height: 18px;
        border: 2px solid #adb5bd;
        border-radius: 4px;
        appearance: none;
        cursor: pointer;
        position: relative;
    }

    .task-checkbox:checked {
        background: #247afa;
        border-color: #247afa;
    }

    .task-checkbox:checked::after {
        content: "✓";
        position: absolute;
        color: white;
        font-size: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .task-text {
        flex: 1;
    }

    .task-actions {
        display: flex;
        gap: 6px;
    }

    .task-btn {
        padding: 6px 10px;
        font-size: 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: #ced4da;
        color: #495057;
        transition: all 0.2s;
    }

    .task-btn:hover {
        background: #adb5bd;
    }

    .task-btn.delete {
        background: #fa5252;
        color: white;
    }

    .task-btn.delete:hover {
        background: #e03131;
    }

    .task-btn.rename {
        background: #fcc419;
        color: #212529;
    }

    .task-btn.rename:hover {
        background: #e69e0b;
    }
`;
container.appendChild(style);

        // === Логика модуля ===
        const input = container.querySelector('.planner-input');
        const addButton = container.querySelector('.planner-btn');
        const taskList = container.querySelector('.planner-list');

        const TASKS_KEY = `planner-tasks-${containerId}`;
        const COMPLETED_KEY = `planner-completed-${containerId}`;

        function getTasks() {
            const data = localStorage.getItem(TASKS_KEY);
            return data ? JSON.parse(data) : [];
        }

        function getCompleted() {
            const data = localStorage.getItem(COMPLETED_KEY);
            return data ? JSON.parse(data) : [];
        }

        function saveTasks(tasks) {
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        }

        function saveCompleted(completed) {
            localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
        }

        function createTaskElement(text) {
            const task = document.createElement('div');
            task.classList.add('planner-task');
            if (getCompleted().includes(text)) {
                task.classList.add('completed');
            }

            task.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${getCompleted().includes(text) ? 'checked' : ''}>
                    <span class="task-text">${text}</span>
                </div>
                <div class="task-actions">
                    <button class="task-btn rename">Ред.</button>
                    <button class="task-btn delete">Уд.</button>
                </div>
            `;

            const checkbox = task.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => {
                const tasks = getCompleted();
                const isCompleted = checkbox.checked;
                const text = task.querySelector('.task-text').textContent;

                if (isCompleted) {
                    if (!tasks.includes(text)) tasks.push(text);
                    task.classList.add('completed');
                } else {
                    const filtered = tasks.filter(t => t !== text);
                    task.classList.remove('completed');
                    saveCompleted(filtered);
                    return;
                }
                saveCompleted(tasks);
            });

            task.querySelector('.task-btn.delete').addEventListener('click', () => {
                const tasks = getTasks();
                const text = task.querySelector('.task-text').textContent;
                const filtered = tasks.filter(t => t !== text);
                saveTasks(filtered);
                task.remove();
            });

            task.querySelector('.task-btn.rename').addEventListener('click', () => {
                const taskTextEl = task.querySelector('.task-text');
                const oldText = taskTextEl.textContent;

                const inputRename = document.createElement('input');
                inputRename.type = 'text';
                inputRename.value = oldText;
                inputRename.className = 'planner-input rename';
                inputRename.style.fontSize = '14px';
                inputRename.style.padding = '6px';
                inputRename.style.margin = '0';

                taskTextEl.replaceWith(inputRename);
                inputRename.focus();

                const onSave = () => {
                    const newValue = inputRename.value.trim();
                    if (!newValue || newValue === oldText) {
                        inputRename.replaceWith(taskTextEl);
                        return;
                    }

                    const tasks = getTasks();
                    const index = tasks.indexOf(oldText);
                    if (index !== -1) {
                        tasks[index] = newValue;
                        saveTasks(tasks);
                    }

                    taskTextEl.textContent = newValue;
                    inputRename.replaceWith(taskTextEl);
                };

                inputRename.addEventListener('keydown', e => {
                    if (e.key === 'Enter') onSave();
                    if (e.key === 'Escape') inputRename.replaceWith(taskTextEl);
                });

                inputRename.addEventListener('blur', onSave);
            });

            return task;
        }

        function addTask() {
            const text = input.value.trim();
            if (!text) return;

            const tasks = getTasks();
            if (tasks.includes(text)) {
                input.value = '';
                return;
            }

            tasks.push(text);
            saveTasks(tasks);

            const task = createTaskElement(text);
            taskList.prepend(task);

            input.value = '';
        }

        addButton.addEventListener('click', addTask);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') addTask();
        });

        // Загрузка сохранённых задач
        getTasks().forEach(text => {
            const task = createTaskElement(text);
            taskList.appendChild(task);
        });
    }
};