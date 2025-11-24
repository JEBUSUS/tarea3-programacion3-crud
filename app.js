let tasks = [];
let editingId = null;

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const tbody = document.getElementById("tasksBody");
  tbody.innerHTML = "";

  tasks.forEach(task => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.status}</td>
      <td>
        <button class="btn-edit" data-id="${task.id}">Editar</button>
        <button class="btn-delete" data-id="${task.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetForm() {
  document.getElementById("taskForm").reset();
  editingId = null;
  document.getElementById("submitBtn").textContent = "Guardar";
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status").value;

  if (!title) {
    alert("El título es obligatorio");
    return;
  }

  if (editingId !== null) {
    const index = tasks.findIndex(t => t.id === editingId);
    if (index !== -1) {
      tasks[index].title = title;
      tasks[index].description = description;
      tasks[index].status = status;
    }
  } else {
    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = { id: newId, title, description, status };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  resetForm();
}

function handleTableClick(e) {
  const id = parseInt(e.target.dataset.id, 10);
  if (e.target.classList.contains("btn-edit")) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("status").value = task.status;

    editingId = task.id;
    document.getElementById("submitBtn").textContent = "Actualizar";
  } else if (e.target.classList.contains("btn-delete")) {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();

  document
    .getElementById("taskForm")
    .addEventListener("submit", handleFormSubmit);

  document
    .getElementById("tasksBody")
    .addEventListener("click", handleTableClick);

  document
    .getElementById("cancelEditBtn")
    .addEventListener("click", resetForm);
});
