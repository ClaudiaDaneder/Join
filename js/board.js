

async function init() {
  await loadTaskFromStorage()
  filltoDos();
  renderallTasks();
  includeHTML();  
}

// Globale Variablen für die Aufgabenlisten
let currentTask;
let toDos = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let allTasks=[];


async function loadTaskFromStorage() {
  let allTaskAsString = await getItem('allTasks');
  allTasks = JSON.parse(allTaskAsString);
 
}



function filltoDos() {
  
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    toDos.push(task); 
     console.log(task);
  }
}


function renderallTasks() {
  renderToDo(),
  renderInProgress(),
  renderAwaitFeedback(),
  renderDone(),
  openAndCloseNoTask()
}


function renderToDo() {
  let toDoContainer = document.getElementById("toDo");
  toDoContainer.innerHTML = "";

  toDos.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    toDoContainer.innerHTML += taskHtml;
  });
}


function renderInProgress() {
  let inProgressContainer = document.getElementById("inProgress");
  inProgressContainer.innerHTML = "";

  inProgress.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    inProgressContainer.innerHTML += taskHtml;
  });
}


function renderAwaitFeedback() {
  let awaitFeedbackContainer = document.getElementById("awaitFeedback");
  awaitFeedbackContainer.innerHTML = "";

  awaitFeedback.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    awaitFeedbackContainer.innerHTML += taskHtml;
  });
}


function renderDone() {
  let doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";

  done.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    doneContainer.innerHTML += taskHtml;
  });
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
  let categoryValue = task["category"]
  let splitCategoryValue = categoryValue.split(" ");
  let firstWord = splitCategoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `
          <div class="task" draggable="true" ondragstart="drag(event, this.id)" id="${i}">
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


function drag(ev,id) {
  ev.dataTransfer.setData("text", id);
  ev.dataTransfer.dropEffect = "move";
}


function drop(ev) {
  ev.preventDefault();

  let taskId = ev.dataTransfer.getData("id");
  let taskElement = document.getElementById(taskId);

  if (taskElement && ev.target.appendChild) {
      ev.target.appendChild(taskElement);
  }

  // Initialisiert targetElement mit dem Ziel des Drop-Events.
  let targetElement = ev.target;


  let containerId = targetElement ? targetElement.id : null;
  console.log(containerId)
  if (!containerId) return;

  let taskToMove = findTaskById(taskElement);
  console.log(taskToMove)
  if (!taskToMove) return;

  removeTaskFromCurrentList(taskToMove);

  if (containerId === "toDo") {
      toDos.push(taskToMove);
  } else if (containerId === "inProgress") {
      inProgress.push(taskToMove);
  } else if (containerId === "awaitFeedback") {
      awaitFeedback.push(taskToMove);
  } else if (containerId === "done") {
      done.push(taskToMove);
  }

  renderallTasks();
  openAndCloseNoTask();
}


function findTaskById(taskId) {
  return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(task => task["id"] == taskId);
}


function removeTaskFromCurrentList(task) {
  toDos = toDos.filter(t => t.id !== task["id"]);
  inProgress = inProgress.filter(t => t.id !== task["id"]);
  awaitFeedback = awaitFeedback.filter(t => t.id !== task["id"]);
  done = done.filter(t => t.id !== task["id"]);
}
