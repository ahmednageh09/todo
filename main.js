let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");
let arrayOfTasks = [];

window.onload = function() {
  input.focus();
  calculateTasks()
};

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

getDataFromLocalStorage();
checkTasksDiv();

submit.onclick = function() {
  if (input.value !== "") {
    addTaskToArray(input.value);
    input.value = "";
    checkTasksDiv();
    calculateTasks();
  }
};

tasksDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.remove();
    checkTasksDiv();
    calculateTasks();
  }
  if (e.target.classList.contains("task-checkbox")) {
    toggleStatusTaskWith(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.classList.toggle("done");
    calculateTasks();
  }
});

function addTaskToArray(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  arrayOfTasks.push(task);
  addElementsToPageFrom(arrayOfTasks);
  addDataToLocalStorageFrom(arrayOfTasks);
  input.focus();
}

function addElementsToPageFrom(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    if (task.completed) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    div.appendChild(checkbox);

    let titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.appendChild(document.createTextNode(task.title));
    div.appendChild(titleSpan);

    let deleteButton = document.createElement("span");
    deleteButton.className = "del";
    deleteButton.appendChild(document.createTextNode("Delete"));
    div.appendChild(deleteButton);

    tasksDiv.appendChild(div);
  });
}

function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPageFrom(tasks);
  }
}

function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTasks);
}

function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed = !arrayOfTasks[i].completed;
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}

function checkTasksDiv() {
  let noTasksMsg = document.querySelector(".no-tasks-message");
  if (tasksDiv.children.length === 0) {
    if (!noTasksMsg) {
      createNoTasks();
    }
  } else {
    if (noTasksMsg) {
      noTasksMsg.remove();
    }
  }
}

function createNoTasks() {
  let msgSpan = document.createElement("span");
  msgSpan.appendChild(document.createTextNode("NO TASKS TO SHOW"));
  msgSpan.className = "no-tasks-message";
  tasksDiv.appendChild(msgSpan);
}

function calculateTasks() {
  tasksCount.innerHTML = tasksDiv.querySelectorAll(".task").length;
  tasksCompleted.innerHTML = tasksDiv.querySelectorAll(".task.done").length;
}
