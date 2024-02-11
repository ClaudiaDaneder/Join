let alltasks = [
  {
    title: "Beispiel 1",
    description: "Beschreibung Beispiel 1",
    assignee: "Name 1",
    "due-date": "2024-03-02",
    category: "User Story",
    subtasks: "Subtask Beispiel 1",
    id: 0,
  },
  {
    title: "Beispiel 2",
    description: "Beschreibung Beispiel 2",
    assignee: "Name 2",
    "due-date": "2024-05-02",
    category: "User Story",
    subtasks: "Subtask Beispiel 2",
    id: 1,
  },
  {
    title: "Beispiel 3",
    description: "Beschreibung Beispiel 3",
    assignee: "Name 3",
    "due-date": "2024-07-18",
    category: "Technical Task",
    subtasks: "Subtask Beispiel 3",
    id: 2,
  },
];

/**
 * Initialisiert die Anwendung, füllt die ToDo-Liste und rendert alle Aufgaben.
 */
function init() {
  filltoDos();
  renderAllTasks();
  includeHTML();  
}

// Globale Variablen für die Aufgabenlisten
let currentTask;
let toDos = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];

/**
 * Füllt die toDos-Liste mit Aufgaben aus einer globalen Quelle `alltasks`.
 */
function filltoDos() {
  for (let i = 0; i < alltasks.length; i++) {
    const task = alltasks[i];
    toDos.push(task);
  }
}

/**
 * Ruft Render-Funktionen für alle Aufgabenlisten auf.
 */
function renderAllTasks() {
  renderToDo(),
  renderInProgress(),
  renderAwaitFeedback(),
  renderDone(),
  openAndCloseNoTask()
}

/**
 * Rendert die Aufgaben in der ToDo-Liste.
 */
function renderToDo() {
  let toDoContainer = document.getElementById("toDo");
  toDoContainer.innerHTML = "";

  toDos.forEach((task, index) => {
    const taskHtml = createTaskHtml(task, task["id"]);
    toDoContainer.innerHTML += taskHtml;
  });
}

/**
 * Rendert die Aufgaben in der InProgress-Liste.
 */
function renderInProgress() {
  let inProgressContainer = document.getElementById("inProgress");
  inProgressContainer.innerHTML = "";

  inProgress.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    inProgressContainer.innerHTML += taskHtml;
  });
}

/**
 * Rendert die Aufgaben in der AwaitFeedback-Liste.
 */
function renderAwaitFeedback() {
  let awaitFeedbackContainer = document.getElementById("awaitFeedback");
  awaitFeedbackContainer.innerHTML = "";

  awaitFeedback.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    awaitFeedbackContainer.innerHTML += taskHtml;
  });
}

/**
 * Rendert die Aufgaben in der Done-Liste.
 */
function renderDone() {
  let doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";

  done.forEach(task => {
    const taskHtml = createTaskHtml(task, task["id"]);
    doneContainer.innerHTML += taskHtml;
  });
}

/**
 * Steuert die Anzeige von 'Keine Aufgaben'-Meldungen, abhängig vom Inhalt der Listen.
 */
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

/**
 * Erstellt das HTML für eine einzelne Aufgabe.
 * 
 * @param {Object} task - Das Aufgabenobjekt.
 * @param {number} i - Die ID der Aufgabe.
 * @return {string} Das HTML-String der Aufgabe.
 */
function createTaskHtml(task, i) {
  let categoryValue = task["category"].split(" ");
  let firstWord = categoryValue[0];
  let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
  return `
          <div class="task" draggable="true" ondragstart="drag(event)" id="${i}">
            <div class="${categoryClass}">${task["category"]}</div>
            <div class="previewTitle">${task["title"]}</div>
            <div class="previewDescription">${task["description"]}</div>
          </div>
          `;
}

/**
 * Sucht nach Aufgaben, die den Suchkriterien entsprechen.
 * 
 * @return {Array} Eine Liste von Aufgaben, die den Suchkriterien entsprechen.
 */
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

/**
 * Erlaubt das Ablegen von Elementen während eines Drag-and-Drop-Vorgangs.
 * 
 * @param {Event} ev - Das Drag-and-Drop-Event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Verarbeitet das Ziehen eines Aufgabenelements.
 * 
 * @param {Event} ev - Das Drag-and-Drop-Event.
 */
function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
  ev.dataTransfer.dropEffect = "move";
  openAndCloseNoTask();
}

/**
 * Verarbeitet das Ablegen eines Aufgabenelements.
 * 
 * @param {Event} ev - Das Drag-and-Drop-Event.
 */
function drop(ev) {
  ev.preventDefault();
  let taskId = ev.dataTransfer.getData("id");
  let targetElement = ev.target;
  while (targetElement && !targetElement.id) {
    targetElement = targetElement.parentElement;
  }
  let containerId = targetElement ? targetElement.id : null;

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

  renderAllTasks();
  openAndCloseNoTask();
}

/**
 * Findet eine Aufgabe anhand ihrer ID in allen Listen.
 * 
 * @param {number} taskId - Die ID der zu findenden Aufgabe.
 * @return {Object} Die gefundene Aufgabe, falls vorhanden.
 */
function findTaskById(taskId) {
  return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(task => task["id"] == taskId);
}

/**
 * Entfernt eine Aufgabe aus ihrer aktuellen Liste.
 * 
 * @param {Object} task - Das zu entfernende Aufgabenobjekt.
 */
function removeTaskFromCurrentList(task) {
  toDos = toDos.filter(t => t.id !== task["id"]);
  inProgress = inProgress.filter(t => t.id !== task["id"]);
  awaitFeedback = awaitFeedback.filter(t => t.id !== task["id"]);
  done = done.filter(t => t.id !== task["id"]);
}
