// Get elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const toggleThemeBtn = document.getElementById('toggleTheme');
const pendingCount = document.getElementById('pendingCount');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Clear All Tasks
clearAllBtn.addEventListener('click', () => {
    localStorage.removeItem('tasks');
    taskList.innerHTML = '';
    updatePendingCount();
});

// Toggle Dark Mode
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleThemeBtn.textContent = document.body.classList.contains('dark') ? '☀ Light Mode' : '🌙 Dark Mode';
});

function addTask() {
    const taskValue = taskInput.value.trim();
    if (taskValue === '') return alert('Please enter a task!');

    const li = document.createElement('li');
    li.innerHTML = `${taskValue} <button class="delete-btn">❌</button>`;

    // Toggle completed
    li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            li.classList.toggle('completed');
            saveTasks();
            updatePendingCount();
        }
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks();
        updatePendingCount();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
    updatePendingCount();
}

// Save tasks in local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({ text: li.childNodes[0].textContent.trim(), completed: li.classList.contains('completed') });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.text} <button class="delete-btn">❌</button>`;
        if (task.completed) li.classList.add('completed');

        li.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                li.classList.toggle('completed');
                saveTasks();
                updatePendingCount();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            saveTasks();
            updatePendingCount();
        });

        taskList.appendChild(li);
    });
    updatePendingCount();
}

// Update pending count
function updatePendingCount() {
    const pending = document.querySelectorAll('#taskList li:not(.completed)').length;
    pendingCount.textContent = pending;
}
