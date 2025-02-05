// Task Management
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.pendingCount = document.getElementById('pending-count');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.themeToggle = document.querySelector('.theme-toggle');

        this.setupEventListeners();
        this.renderTasks();
        this.updatePendingCount();
    }

    setupEventListeners() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        document.querySelectorAll('.category').forEach(category => {
            category.addEventListener('click', () => {
                this.filterByCategory(category.dataset.category);
            });
        });
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        const priority = document.getElementById('task-priority').value;

        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                priority: priority,
                category: 'personal',
                createdAt: new Date()
            };

            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
            this.showNotification('Task added successfully!');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updatePendingCount();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updatePendingCount();
        this.showNotification('Task deleted!');
    }

    renderTasks() {
        let filteredTasks = this.tasks;

        if (this.currentFilter === 'pending') {
            filteredTasks = this.tasks.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.completed);
        }

        this.taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-priority="${task.priority}">
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                        onchange="taskManager.toggleTask(${task.id})">
                    <span>${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.showNotification('Completed tasks cleared!');
    }

    updatePendingCount() {
        const pendingTasks = this.tasks.filter(task => !task.completed).length;
        this.pendingCount.textContent = pendingTasks;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updatePendingCount();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    toggleTheme() {
        document.body.dataset.theme = 
            document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', document.body.dataset.theme);
    }
}

// Initialize
const taskManager = new TaskManager();

// Load saved theme
document.body.dataset.theme = localStorage.getItem('theme') || 'light';