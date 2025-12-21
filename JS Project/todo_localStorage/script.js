let textInput = document.getElementById("todo-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("todo-list");
let tasks = localStorage.getItem("tasks") || [];

addTaskBtn.addEventListener("click", () => {
  let taskText = textInput.value.trim();
  if (taskText === "") return;

  let newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  saveTaskToLocalStorage();
  taskRender(tasks);
  textInput.value = "";

  console.log(tasks);
});

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function taskRender(tasks) {
  let task = document.createElement("li");
  task.innerHTML = `<span>${task.text}</span><button>Delete</button>`;
  taskList.appendChild = task;
}
