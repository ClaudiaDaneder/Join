

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


function getInitials(name) {
  let initials = name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
  return initials.length > 1 ? initials : initials + ' '; // Fügt ein Leerzeichen hinzu, falls nur ein Initial vorhanden ist
}

function createAssigneeHtml(assignees) {
  if (!Array.isArray(assignees)) {
    return ''; // Frühzeitige Rückkehr, wenn assignees kein Array ist
  }

  return assignees.map(assigneeObj => {
      let assigneeName = assigneeObj.name; // Zugriff auf die 'name'-Eigenschaft
      let initials = getInitials(assigneeName); // Annahme: getInitials verarbeitet einen String
      return `
          <div class="initial-and-name">
              <div class="initials ${assigneeObj.color}">
                  <h3 class="initials-first-and-last">${initials}</h3>
              </div>
              <h3 class="assigne">${assigneeName}</h3>
          </div>`;
  }).join('');
}



function openCurrentTask(taskId) {
  const { modalOverlay, modulWindow } = initializeDomElements();
  modalOverlay.style.display = "block";
  modulWindow.innerHTML = "";

  const task = findTaskById(taskId);
  if (!task) {
      handleNoTaskFound();
      return;
  }
  const assigneeHtml = createAssigneeHtml(task["assignee-infos"]);
  modulWindow.innerHTML = generateTaskHtml(task, assigneeHtml);
}


function initializeDomElements() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modulWindow = document.getElementById("modal-window");
  return { modalOverlay, modulWindow };
}


function findTaskById(taskId) {
  return allTasks.find(element => parseInt(element["task-id"]) === parseInt(taskId));
}


function handleNoTaskFound() {
  // Logik für den Fall, dass kein Task gefunden wird
}

function generateTaskHtml(task, assigneeHtml) {
  console.log(task);
  const firstPart = task.category.split(" ")[0].toLowerCase();
  return `
      <div class="overHeadline">
          <div class="${firstPart}"><h2 class="category-h2">${task["category"]}</h2></div>
          <div><img onclick="closeModal()" class="close-png" src="./img/close.png" alt=""></div>
      </div>
      <div class="Headline"><h1 class="current-task-headline">${task["title"]} </h1></div>
      <div class="description"><h3 class="current-task-description">${task["description"]} </h3></div>
      <div class="due-date"><h3 class="color-dar-blue">Due date: </h3><h3>${task["due-date"].replace(/-/g, '/')}</h3></div>
      <div class="current-prio"><h3 class="prio color-dar-blue">Priority:</h3><h3 > ${task["prio"]} </h3></div>
      <div class="assigne-container" id="assigne">
          <h3 class="color-dar-blue">Assigned To: </h3>
          ${assigneeHtml}
      </div>
      <h3 class="current-subtask">Subtask:</h3>
      <div class="subtasks">${task["subtasks"]}</div>
      `;
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


function drag(ev, id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add('rotating');
  }
  ev.dataTransfer.setData("id", id);
  ev.dataTransfer.dropEffect = "move";
}

document.addEventListener('DOMContentLoaded', (event) => {
  const draggableElements = document.querySelectorAll('.draggable');
  draggableElements.forEach(element => {
    element.addEventListener('dragend', function() {
      this.classList.remove('rotating');
    });
  });
});


function determineTargetElement(ev) {
  let targetElement = ev.target.classList.contains('noTask') ? ev.target.nextElementSibling : ev.target;
  while (targetElement && !targetElement.classList.contains('taskColumn')) {
    targetElement = targetElement.parentElement;
  }
  return targetElement;
}


function moveTaskToColumn(taskElement, targetElement) {
  targetElement.appendChild(taskElement);
}


function updateTaskList(taskId, containerId) {
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
}


function drop(ev) {
  ev.preventDefault();
  let taskId = ev.dataTransfer.getData("id");
  let taskElement = document.getElementById(taskId);
  if (!taskElement) return;

  let targetElement = determineTargetElement(ev);
  if (!targetElement || !targetElement.id) return;

  moveTaskToColumn(taskElement, targetElement);
  updateTaskList(taskId, targetElement.id);

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