// ========== TASK MANAGER DASHBOARD — CRUD + LocalStorage ==========

// Load tasks from LocalStorage or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Track if we are editing a task (stores task id being edited, or null)
let editingTaskId = null;

// ========== ADD TASK ==========
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) {
        showToast("Task cannot be empty!", "error");
        return;
    }

    if (editingTaskId !== null) {
        // UPDATE existing task
        tasks = tasks.map(t => {
            if (t.id === editingTaskId) {
                return { ...t, name: text };
            }
            return t;
        });
        showToast("Task updated successfully!", "success");
        cancelEdit();
    } else {
        // CREATE new task
        tasks.push({ id: Date.now(), name: text, completed: false });
        showToast("Task added successfully!", "success");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    displayTasks();
}

// ========== DISPLAY TASKS ==========
function displayTasks() {
    const list = document.getElementById("taskList");
    if (!list) return;

    // Apply current search and filter
    const query = document.getElementById("searchBox").value.toLowerCase();
    const filter = document.getElementById("filterSelect").value;

    let filtered = tasks.filter(t => {
        // Search filter
        if (query && !t.name.toLowerCase().includes(query)) return false;
        // Status filter
        if (filter === "completed" && !t.completed) return false;
        if (filter === "pending" && t.completed) return false;
        return true;
    });

    if (tasks.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-clipboard-list"></i></div>
                <h3>No Tasks Yet</h3>
                <p>Add your first task using the input above to get started!</p>
            </div>
        `;
    } else if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-search"></i></div>
                <h3>No Matching Tasks</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        `;
    } else {
        list.innerHTML = filtered.map((t, index) => `
            <li class="task-item ${t.completed ? 'task-completed' : ''}" style="animation-delay: ${index * 0.05}s">
                <div class="task-content">
                    <button class="task-check ${t.completed ? 'checked' : ''}" onclick="toggleComplete(${t.id})" title="${t.completed ? 'Mark as pending' : 'Mark as completed'}" id="check-${t.id}">
                        <i class="fas ${t.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                    </button>
                    <span class="task-name" id="name-${t.id}">${escapeHTML(t.name)}</span>
                </div>
                <div class="task-actions">
                    <button class="task-btn task-btn-edit" onclick="editTask(${t.id})" title="Edit task" id="edit-${t.id}">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="task-btn task-btn-delete" onclick="deleteTask(${t.id})" title="Delete task" id="delete-${t.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }

    updateStats();
}

// ========== DELETE TASK ==========
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showToast("Task deleted!", "success");
    displayTasks();
}

// ========== EDIT TASK ==========
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const input = document.getElementById("taskInput");
    input.value = task.name;
    input.focus();

    editingTaskId = id;

    // Update UI to show editing mode
    document.getElementById("inputBoxTitle").textContent = "Edit Task";
    document.getElementById("addBtnText").textContent = "Update Task";
    document.getElementById("cancelEditBtn").style.display = "inline-flex";
    document.getElementById("dashboard-input-box").classList.add("editing-mode");
}

// ========== CANCEL EDIT ==========
function cancelEdit() {
    editingTaskId = null;
    document.getElementById("taskInput").value = "";
    document.getElementById("inputBoxTitle").textContent = "Add New Task";
    document.getElementById("addBtnText").textContent = "Add Task";
    document.getElementById("cancelEditBtn").style.display = "none";
    document.getElementById("dashboard-input-box").classList.remove("editing-mode");
}

// ========== TOGGLE COMPLETE ==========
function toggleComplete(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// ========== SEARCH TASKS ==========
function searchTasks() {
    displayTasks();
}

// ========== FILTER TASKS ==========
function filterTasks() {
    displayTasks();
}

// ========== UPDATE STATS ==========
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const totalEl = document.getElementById("totalCount");
    const completedEl = document.getElementById("completedCount");
    const pendingEl = document.getElementById("pendingCount");

    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (pendingEl) pendingEl.textContent = pending;
}

// ========== ESCAPE HTML (XSS Prevention) ==========
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========== ENTER KEY SUPPORT ==========
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("taskInput");
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                addTask();
            }
        });
    }
});

// ========== LOAD TASKS ON PAGE LOAD ==========
displayTasks();
