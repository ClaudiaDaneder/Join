let alltasks = [
  {
      "title": "Beispiel 1",
      "description": "Beschreibung Beispiel 1",
      "assignee": "Name 1",
      "due-date": "2024-03-02",
      "category": "User Story",
      "subtasks": "Subtask Beispiel 1",
      "id":0
  },
  {
      "title": "Beispiel 2",
      "description": "Beschreibung Beispiel 2",
      "assignee": "Name 2",
      "due-date": "2024-05-02",
      "category": "User Story",
      "subtasks": "Subtask Beispiel 2",
      "id":0
  },
  {
      "title": "Beispiel 3",
      "description": "Beschreibung Beispiel 3",
      "assignee": "Name 3",
      "due-date": "2024-07-18",
      "category": "Technical Task",
      "subtasks": "Subtask Beispiel 3",
      "id":0
  }
];

function init() {
  renderToDo();
  includeHTML();
  openAndCloseNoTask();
}
let currentTask;

let toDo=[];
let inProgress=[];
let awaitFeedback=[];
let done=[];


function renderToDo() {
  let toDoContainer = document.getElementById("toDo");
  toDoContainer.innerHTML = "";

  for (let i = 0; i < alltasks.length; i++) {
    const task = alltasks[i];
    const taskHtml = createTaskHtml(task, i);
    toDoContainer.innerHTML += taskHtml;
    toDo.push(task);
  }
  
}


function openAndCloseNoTask() {
  let toDo = document.getElementById("toDo");
  let inProgress = document.getElementById("inProgress");
  let awaitFeedback = document.getElementById("awaitFeedback");
  let done = document.getElementById("done");

  document.getElementById("noTaskToDo").style.display =
    toDo.innerHTML == "" ? "" : "none";
  document.getElementById("noTaskInProgress").style.display =
    inProgress.innerHTML == "" ? "" : "none";
  document.getElementById("noTaskAwaitFeedback").style.display =
    awaitFeedback.innerHTML == "" ? "" : "none";
  document.getElementById("noTaskDone").style.display =
    done.innerHTML == "" ? "" : "none";
}


function createTaskHtml(task, i) {
  let categoryValue = task["category"].split(" ");
  let firstWord = categoryValue[0];
  let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
  return `
          <div class="task" draggable="true" ondragstart="drag(event)" id="task_${i}">
            <div class="${categoryClass}">${task["category"]}</div>
            <div class="previewTitle">${task["title"]}</div>
            <div class="previewDescription">${task["description"]}</div>
          </div>
          `;
}


function searchTasks() {
  let searchValue = document.getElementById("searchInput").value;
  let matchingTasks = [];
  for (let i = 0; i < allTasks.length; i++) {
    if (
      allTasks[i]["title"].toLowerCase().includes(searchValue) ||
      allTasks[i]["description"].toLowerCase().includes(searchValue) ||
      allTasks[i]["category"].toLowerCase().includes(searchValue)
    ) {
      matchingTasks.push(allTasks[i]);
    }
  }
  return matchingTasks;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
  currentTask=ev.target.id;

  openAndCloseNoTask();
}


function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("id");
  ev.target.appendChild(document.getElementById(data));
  openAndCloseNoTask();
}
