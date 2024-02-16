

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

  for (let i = 0; i < toDos.length; i++) {
    const taskHtml = createTaskHtml(toDos[i], toDos[i]["task-id"]);
    toDoContainer.innerHTML += taskHtml;
  }
}


function renderInProgress() {
  let inProgressContainer = document.getElementById("inProgress");
  inProgressContainer.innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    const taskHtml = createTaskHtml(inProgress[i], inProgress[i]["task-id"]);
    inProgressContainer.innerHTML += taskHtml;
  }
}


function renderAwaitFeedback() {
  let awaitFeedbackContainer = document.getElementById("awaitFeedback");
  awaitFeedbackContainer.innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const taskHtml = createTaskHtml(awaitFeedback[i], awaitFeedback[i]["task-id"]);
    awaitFeedbackContainer.innerHTML += taskHtml;
  }
}


function renderDone() {
  let doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const taskHtml = createTaskHtml(done[i], done[i]["task-id"]);
    doneContainer.innerHTML += taskHtml;
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


function createTaskHtml(task, taskId) {
  let categoryValue = task.category;
  let splitCategoryValue = categoryValue.split(" ");
  let firstWord = splitCategoryValue[0];
  let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);

  return `
    <div class="task" onclick="openCurrentTask('${taskId}')" draggable="true" ondragstart="drag(event, '${taskId}')" id="${taskId}">
      <div class="${categoryClass}">${task.category}</div>
      <div class="previewTitle">${task.title}</div>
      <div class="previewDescription">${task.description}</div>
    </div>
  `;
}


function openCurrentTask(taskId){
  document.getElementById("modal-overlay").style.display = "block";
  let modulWindow = document.getElementById("modal-window");
  modulWindow.innerHTML = "";
  

  for (let i = 0; i < allTasks.length; i++) {
      const element = allTasks[i];
      
      // Konvertieren beider IDs in integer
      let elementTaskId = parseInt(element["task-id"]);
      let stringTaskId = parseInt(taskId);
      let category = element["category"];
      let firstPart = category.split(" ")[0].toLowerCase();
      if (elementTaskId === stringTaskId) { 
          modulWindow.innerHTML +=`
          <div class="overHeadline">
              <div class="${firstPart}"><h2>${element["category"]}</h2></div>
              <div> <img onclick="closeModal()" class="close-png" src="./img/close.png" alt=""></div>
          </div>
          <div class="Headline"><h1 class="current-task-headline">${element["title"]} </h1></div>
          <div class="due-date"><h3>Due date: ${element["due-date"]}</h3></div>
          <div class="current-prio"><h3 class="prio">Priotiy: ${element["prio"]} </h3></div>
          `;
      }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  let modalWindow = document.getElementById("modal-window");

  // Event-Listener, der das Klick-Ereignis abfängt
  modalWindow.addEventListener('click', function(event) {
      // Verhindert, dass das Klick-Ereignis zum modal-overlay propagiert wird
      event.stopPropagation();
  });
});


function closeModal() {
    document.getElementById("modal-overlay").style.display = "none";

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
  console.log("matchingTasks" + matchingTasks)

  return matchingTasks;
  
}


function allowDrop(ev) {
  ev.preventDefault();
}


function drag(ev,id) {
  ev.dataTransfer.setData("id", id);
  ev.dataTransfer.dropEffect = "move";
}


function drop(ev) {
  ev.preventDefault();

  let taskId = ev.dataTransfer.getData("id");
  let taskElement = document.getElementById(taskId);

  if (!taskElement) return;

  let targetElement = ev.target.classList.contains('noTask') ? ev.target.nextElementSibling : ev.target;

  while (targetElement && !targetElement.classList.contains('taskColumn')) {
    targetElement = targetElement.parentElement;
  }

  if (!targetElement) return;

  targetElement.appendChild(taskElement);

  let containerId = targetElement.id;
  if (!containerId) return;

  let taskToMove = findTaskById(taskId);
  if (!taskToMove) return;

  removeTaskFromCurrentList(taskToMove);

  switch (containerId) {
    case "toDo":
      toDos.push(taskToMove);
      break;
    case "inProgress":
      inProgress.push(taskToMove);
      break;
    case "awaitFeedback":
      awaitFeedback.push(taskToMove);
      break;
    case "done":
      done.push(taskToMove);
      break;
  }
  openAndCloseNoTask();
  renderallTasks();
  
}



function findTaskById(taskId) {
  return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(task => task["task-id"] == taskId);
}

function removeTaskFromCurrentList(taskToRemove) {
  // Entfernt das Task-Objekt nur aus seiner aktuellen Liste
  if (toDos.includes(taskToRemove)) {
    toDos = toDos.filter(task => task["task-id"] !== taskToRemove["task-id"]);
  } else if (inProgress.includes(taskToRemove)) {
    inProgress = inProgress.filter(task => task["task-id"] !== taskToRemove["task-id"]);
  } else if (awaitFeedback.includes(taskToRemove)) {
    awaitFeedback = awaitFeedback.filter(task => task["task-id"] !== taskToRemove["task-id"]);
  } else if (done.includes(taskToRemove)) {
    done = done.filter(task => task["task-id"] !== taskToRemove["task-id"]);
  }
}

