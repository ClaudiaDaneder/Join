//Initialisierung
async function init() {
  includeHTML();
  await loadTaskFromStorage();
  fillTasks();
  renderallTasks();
  initOnline();
  enableNavigation();
  navigation('show');
}


//Globale Variablen
let currentTask;
let toDos = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let allTasks = [];
let currentSubTasks = [];
let subTask=[];
let searchResults = [];


// Datenladen und -verarbeiten
async function loadTaskFromStorage() {
  let allTaskAsString = await getItem("allTasks");
  allTasks = JSON.parse(allTaskAsString);
}


function fillTasks() {
  toDos = []; 
  inProgress = [];
  awaitFeedback = [];
  done = [];
  for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      subTask.push(task["subtasks"].length);
      if (task["status"] === "toDos") {
        toDos.push(task);
      } else {
        if (task["status"] === "inProgress") {
          inProgress.push(task);
        } else {
          if (task["status"] === "awaitFeedback") {
            awaitFeedback.push(task);
          } else {
            if (task["status"] === "done") {
              done.push(task);
            } else {
            }
          }
        }
      }
    }
}


//Rendering und UI Updates
function renderallTasks() {
    renderToDo(),
    renderInProgress(),
    renderAwaitFeedback(),
    renderDone(),
    openAndCloseNoTask();
}

function updateTaskElement(taskId, isHighlighted) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    if (isHighlighted) {
      taskElement.classList.add('highlight');
    } else {
      taskElement.classList.remove('highlight');
    }
  }
}

function renderToDo() {
  let toDoContainer = document.getElementById("toDo");

  // Aktualisieren bestehender Elemente
  toDos.forEach(task => {
    updateTaskElement(task["task-id"], searchResults.includes(task["task-id"]));
  });

  // Fügen Sie neue Aufgaben hinzu, falls welche fehlen
  toDos.forEach(task => {
    if (!document.getElementById(task["task-id"])) {
      const taskHtml = createTaskHtml(task, task["task-id"], searchResults.includes(task["task-id"]));
      toDoContainer.innerHTML += taskHtml;
    }
  });
}



function renderInProgress() {
  let inProgressContainer = document.getElementById("inProgress");
  inProgressContainer.innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    let isHighlighted = searchResults.includes(inProgress[i]["task-id"]);
    const taskHtml = createTaskHtml(inProgress[i], inProgress[i]["task-id"], isHighlighted);
    inProgressContainer.innerHTML += taskHtml;
  }
}




function renderAwaitFeedback() {
  let feedbackContainer = document.getElementById("awaitFeedback");
  feedbackContainer.innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    let isHighlighted = searchResults.includes(awaitFeedback[i]["task-id"]);
    const taskHtml = createTaskHtml(awaitFeedback[i], awaitFeedback[i]["task-id"], isHighlighted);
    feedbackContainer.innerHTML += taskHtml;
  }
}



function renderDone() {
  let doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    let isHighlighted = searchResults.includes(done[i]["task-id"]);
    const taskHtml = createTaskHtml(done[i], done[i]["task-id"], isHighlighted);
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


//Task-Erstellung und -Verarbeitung
function getCategoryClass(category) {
  let firstWord = category.split(" ")[0];
  return firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
}


function calculateSubtaskProgress(subtasks) {
  let completedSubtasks = subtasks.filter(subtask => subtask.done).length;
  let percentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
  return percentage + "%";
}


function createProgressBar(subtaskPercentage, completedSubtasks, totalSubtasks) {
  return `
    <div class="ProgressBar-container">
      <div class="ProgressBarBox">
        <div id="progressbar" style='width:${subtaskPercentage}!important;'></div>
      </div>
      <h3 class="progressString">${completedSubtasks} / ${totalSubtasks} Subtasks</h3>
    </div>
  `;
}


function createTaskHtml(task, taskId, isHighlighted) {
  let highlightClass = isHighlighted ? "highlight" : "";
  let categoryClass = getCategoryClass(task.category);
  let subtaskPercentage = calculateSubtaskProgress(task["subtasks"]);
  let progressBarHtml = createProgressBar(subtaskPercentage, task["subtasks"].filter(subtask => subtask.done).length, task["subtasks"].length);
  

  return `
    <div class="task ${highlightClass}" onchange="openCurrentTask('${taskId}')" draggable="true" ondragstart="drag(event, '${taskId}')" id="${taskId}">
      <div class="${categoryClass}">${task.category}</div>
      <div class="previewTitle">${task.title}</div>
      <div class="previewDescription">${task.description}</div>
      ${progressBarHtml}
    </div>
  `;
}



function createAssigneeHtml(assignees) {
  if (!Array.isArray(assignees)) {
    return "";
  }

  let html = "";
  for (let i = 0; i < assignees.length; i++) {
    let assigneeObj = assignees[i];
    let assigneeName = assigneeObj.name;
    let initials = getInitials(assigneeName);
    html += `
        <div class="initial-and-name">
            <div class="initials ${assigneeObj.color}">
                <h3 class="initials-first-and-last">${initials}</h3>
            </div>
            <h3 class="assignee">${assigneeName}</h3>
        </div>`;
  }

  return html;
}


function createSubtasksHtml(subTasks) {
  let subTaskhtml = "";
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i]["subtasktext"];
    let imgSrc = subTasks[i].done ? "./img/checked.png" : "./img/none-checked.png"; // Bestimmen des Bildpfads basierend auf dem done-Status
    subTaskhtml += `<div class="subtask-current-box"><img id="checkBox_${i}" onclick="changeSubBox(${i})" src=${imgSrc}><h4 class="subtask-font">${subTask}</h4></div>`;
  }
  return subTaskhtml;
}


function generateTaskHtml(task, assigneeHtml, subTasksHtml) {
  const firstPart = task.category.split(" ")[0].toLowerCase();
  return `
      <div class="width-height-full-prozent">
        <div class="overHeadline">
            <div class="${firstPart}"><h2 class="category-h2">${task["category"]}</h2></div>
            <div><img onclick="closeModal()" class="close-png" src="./img/close.png" alt=""></div>
        </div>
        <div class="Headline"><h1 class="current-task-headline">${task["title"]} </h1></div>
        <div class="description"><h3 class="current-task-description">${task["description"]} </h3></div>
        <div class="due-date"><h3 class="color-dar-blue">Due date: </h3><h3>${task["due-date"].replace(/-/g, "/")}</h3></div>
        <div class="current-prio"><h3 class="prio color-dar-blue">Priority:</h3><h3> ${task["prio"]} </h3></div>
        <div class="assigne-container" id="assigne">
            <h3 class="color-dar-blue">Assigned To: </h3>
            ${assigneeHtml}
        </div>
          <h3 class="current-subtask">Subtask:</h3>
          <div class="subtasks">
          ${subTasksHtml}
        </div>
        <div class="delet-edit-container">
          <div></div>
          <div class="delet-edit-box">
            <div class="delete-box" onclick="deletThisArray(${task["task-id"]})">
              <div class=""><img class="delete-svg" src="./img/delete.svg"></div>
              <div class=""><h4 class="delet-string">Delete</h4></div>
            </div>
            <img src="./img/delet-edit-line.png">
            <div onclick="editTask()" class="edit-box">
              <div class=""><img class="edit-svg" src="./img/edit.svg"></div>
              <div class=""  ><h4 class="edit-string">Edit</h4></div>
            </div>
          </div>
        </div>
      </div>
      `;
}


//Task Interaktion
function findTaskById(taskId) {
  return allTasks.find(
    (element) => parseInt(element["task-id"]) === parseInt(taskId)
  );
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
  currentSubTasks = task["subtasks"];
  const subTasksHtml = createSubtasksHtml(task["subtasks"]);
  const assigneeHtml = createAssigneeHtml(task["assignee-infos"]);
  modulWindow.innerHTML = generateTaskHtml(task, assigneeHtml, subTasksHtml);
}


function changeSubBox(i) {
  var checkBox = document.getElementById("checkBox_" + i);
  if (checkBox) {
    if (currentSubTasks[i].done) {
      checkBox.src = "./img/none-checked.png";
      currentSubTasks[i].done = false; // Aktualisieren von done auf false
    } else {
      checkBox.src = "./img/checked.png";
      currentSubTasks[i].done = true; // Aktualisieren von done auf true
    }
  }
  upDateAllDate();
}


function closeCurrentTask() {
  let modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.style.display = "none";
}


async function deletThisArray(taskId) {
  let foundIndex = -1;
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i]["task-id"] === taskId) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex !== -1) {
    allTasks.splice(foundIndex, 1);
    await setItem("allTasks", allTasks);
    console.log(`Task mit ID ${taskId} wurde gelöscht.`);
  } else {
    console.log(`Task mit ID ${taskId} nicht gefunden.`);
  }
  closeCurrentTask();
  await init();
}


function editTask() {}


//Drag and Drop Logik
function allowDrop(ev) {
  ev.preventDefault();
}


function drag(ev, id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("rotating");
    element.addEventListener("dragend", () => {
      element.classList.remove("rotating");
    });
  }
  ev.dataTransfer.setData("id", id);
  ev.dataTransfer.dropEffect = "move";
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
  upDateAllDate();
}


function determineTargetElement(ev) {
  let targetElement = ev.target.classList.contains("noTask")
    ? ev.target.nextElementSibling
    : ev.target;
  while (targetElement && !targetElement.classList.contains("taskColumn")) {
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
      taskToMove["status"] = "toDos";
      toDos.push(taskToMove);
      break;
    case "inProgress":
      taskToMove["status"] = "inProgress";
      inProgress.push(taskToMove);
      break;
    case "awaitFeedback":
      taskToMove["status"] = "awaitFeedback";
      awaitFeedback.push(taskToMove);
      break;
    case "done":
      taskToMove["status"] = "done";
      done.push(taskToMove);
      break;
  }
}


function removeTaskFromCurrentList(taskToRemove) {
  if (toDos.includes(taskToRemove)) {
    toDos = toDos.filter((task) => task["task-id"] !== taskToRemove["task-id"]);
  } else if (inProgress.includes(taskToRemove)) {
    inProgress = inProgress.filter(
      (task) => task["task-id"] !== taskToRemove["task-id"]
    );
  } else if (awaitFeedback.includes(taskToRemove)) {
    awaitFeedback = awaitFeedback.filter(
      (task) => task["task-id"] !== taskToRemove["task-id"]
    );
  } else if (done.includes(taskToRemove)) {
    done = done.filter((task) => task["task-id"] !== taskToRemove["task-id"]);
  }
}


//Task-Listen-Verwaltung
async function upDateAllDate() {
  allTasks = [];
  for (let i = 0; i < toDos.length; i++) {
    const element = toDos[i];
    allTasks.push(element);
  }
  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    allTasks.push(element);
  }
  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    allTasks.push(element);
  }
  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    allTasks.push(element);
  }
  await setItem("allTasks", allTasks);
}


//Suchfunktion
function searchTasks() {
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  searchResults = [];

  // Nur suchen, wenn der Suchwert nicht leer ist
  if (searchValue.trim() !== "") {
      for (let i = 0; i < allTasks.length; i++) {
          if (allTasks[i].title.toLowerCase().includes(searchValue) ||
              allTasks[i].description.toLowerCase().includes(searchValue) ||
              allTasks[i].category.toLowerCase().includes(searchValue)) {
              searchResults.push(allTasks[i]["task-id"]);
          }
      }
  }

  renderallTasks(); 
}




//Hilfsfunktionen und Event Listener
function getInitials(name) {
  let initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials.length > 1 ? initials : initials + " "; // Fügt ein Leerzeichen hinzu, falls nur ein Initial vorhanden ist
}


function initializeDomElements() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modulWindow = document.getElementById("modal-window");
  return { modalOverlay, modulWindow };
}


function handleNoTaskFound() {
  // Logik für den Fall, dass kein Task gefunden wird
}


document.querySelectorAll('.current-task-headline').forEach(container => {
  container.addEventListener('click', function() {
    if (this.style.whiteSpace === 'nowrap') {
      // Vollständigen Text anzeigen
      this.style.whiteSpace = 'normal';
      this.style.overflow = 'visible';
      this.style.textOverflow = 'clip';
    } else {
      // Text wieder abschneiden
      this.style.whiteSpace = 'nowrap';
      this.style.overflow = 'hidden';
      this.style.textOverflow = 'ellipsis';
    }
  });
});


document.addEventListener("DOMContentLoaded", (event) => {
  let modalWindow = document.getElementById("modal-window");
  // Event-Listener, der das Klick-Ereignis abfängt
  modalWindow.addEventListener("click", function (event) {
    // Verhindert, dass das Klick-Ereignis zum modal-overlay propagiert wird
    event.stopPropagation();
  });
});


function closeModal() {
  renderallTasks();
  document.getElementById("modal-overlay").style.display = "none";
}


document.addEventListener("DOMContentLoaded", (event) => {
  const draggableElements = document.querySelectorAll(".draggable");
  draggableElements.forEach((element) => {
    element.addEventListener("dragend", function () {
      this.classList.remove("rotating");
    });
  });
});


function findTaskById(taskId) {
  return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(
    (task) => task["task-id"] == taskId
  );
}




