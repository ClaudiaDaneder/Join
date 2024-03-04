//Initialisierung
async function init() {
  await includeHTML();
  await loadTaskFromStorage();
  await fillTasks();
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
let allDownloadTasks = [];
let currentSubTasks = [];
let boardSubTask = [];
let searchResults = [];

function openAddTask(status) {
  document.getElementById('my-form').value = status;
  document.getElementById("addTaskContainerBG").classList.remove('hide');
  document.getElementById('addTaskContainer').classList.remove('animate-slide-out');
  setTimeout(function () {
    document.getElementById("addTaskContainer").classList.remove('hide');
    document.getElementById('addTaskContainer').classList.add('animate-slide-in');
  }, 100)
}

function closeAddTask() {
  document.getElementById('my-form').value = '';
  document.getElementById('addTaskContainer').classList.remove('animate-slide-in');
  document.getElementById('addTaskContainer').classList.add('animate-slide-out');
  setTimeout(function () {
    document.getElementById("addTaskContainer").classList.add('hide');
    document.getElementById("addTaskContainerBG").classList.add('hide');
  }, 500);

}


// Datenladen und -verarbeiten
async function loadTaskFromStorage() {
  let allTaskAsString = await getItem("allTasks");
  allDownloadTasks = JSON.parse(allTaskAsString);
}

function addTaskToCategory(task) {
  switch (task["status"]) {
    case "toDos":
      toDos.push(task);
      break;
    case "inProgress":
      inProgress.push(task);
      break;
    case "awaitFeedback":
      awaitFeedback.push(task);
      break;
    case "done":
      done.push(task);
      break;
    default:
      console.warn("Unbekannter Status:", task["status"]);
  }
}


async function fillTasks() {
  toDos = [];
  inProgress = [];
  awaitFeedback = [];
  done = [];

  for (let i = 0; i < allDownloadTasks.length; i++) {
    const task = allDownloadTasks[i];
    boardSubTask.push(task["subtasks"].length);
    addTaskToCategory(task);
  }
}


function renderallTasks() {
  renderToDo(),
    renderInProgress(),
    renderAwaitFeedback(),
    renderDone(),
    openAndCloseNoTask();
}


function renderToDo() {
  let toDoContainer = document.getElementById("toDo");
  toDoContainer.innerHTML = "";
  for (let i = 0; i < toDos.length; i++) {
    let isHighlighted = searchResults.length === 0 || searchResults.includes(toDos[i]["task-id"]);
    if (isHighlighted) {
      const taskHtml = createTaskHtml(toDos[i], toDos[i]["task-id"], true);
      toDoContainer.innerHTML += taskHtml;
    }
  }
}


function renderInProgress() {
  let inProgressContainer = document.getElementById("inProgress");
  inProgressContainer.innerHTML = "";
  for (let i = 0; i < inProgress.length; i++) {
    let isHighlighted = searchResults.length === 0 || searchResults.includes(inProgress[i]["task-id"]);
    if (isHighlighted) {
      const taskHtml = createTaskHtml(inProgress[i], inProgress[i]["task-id"], true);
      inProgressContainer.innerHTML += taskHtml;
    }
  }
}


function renderAwaitFeedback() {
  let feedbackContainer = document.getElementById("awaitFeedback");
  feedbackContainer.innerHTML = "";
  for (let i = 0; i < awaitFeedback.length; i++) {
    let isHighlighted = searchResults.length === 0 || searchResults.includes(awaitFeedback[i]["task-id"]);
    if (isHighlighted) {
      const taskHtml = createTaskHtml(awaitFeedback[i], awaitFeedback[i]["task-id"], true);
      feedbackContainer.innerHTML += taskHtml;
    }
  }
}


function renderDone() {
  let doneContainer = document.getElementById("done");
  doneContainer.innerHTML = "";
  for (let i = 0; i < done.length; i++) {
    let isHighlighted = searchResults.length === 0 || searchResults.includes(done[i]["task-id"]);
    if (isHighlighted) {
      const taskHtml = createTaskHtml(done[i], done[i]["task-id"], true);
      doneContainer.innerHTML += taskHtml;
    }
  }
}


function openAndCloseNoTask() {
  let toDo = document.getElementById("toDo");
  let inProgress = document.getElementById("inProgress");
  let awaitFeedback = document.getElementById("awaitFeedback");
  let done = document.getElementById("done");

  document.getElementById("noTaskToDo").style.display =
    toDo.children.length === 0 ? "" : "none";
  document.getElementById("noTaskInProgress").style.display =
    inProgress.children.length === 0 ? "" : "none";
  document.getElementById("noTaskAwaitFeedback").style.display =
    awaitFeedback.children.length === 0 ? "" : "none";
  document.getElementById("noTaskDone").style.display =
    done.children.length === 0 ? "" : "none";
}


async function upDateAllDate() {
  allDownloadTasks = [];
  for (let i = 0; i < toDos.length; i++) {
    const element = toDos[i];
    allDownloadTasks.push(element);
  }
  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    allDownloadTasks.push(element);
  }
  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    allDownloadTasks.push(element);
  }
  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    allDownloadTasks.push(element);
  }
  await setItem("allTasks", allDownloadTasks);
}


function searchTasks() {
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  searchResults = [];
  if (searchValue.trim() !== 0) {
    for (let i = 0; i < allDownloadTasks.length; i++) {
      if (allDownloadTasks[i].title.toLowerCase().includes(searchValue) ||
        allDownloadTasks[i].description.toLowerCase().includes(searchValue) ||
        allDownloadTasks[i].category.toLowerCase().includes(searchValue)) {
        searchResults.push(allDownloadTasks[i]["task-id"]);
      }
    }
  }

  renderallTasks();
}


function endSearch() {
  document.getElementById("searchInput").value = "";
  searchResults = [];
  renderallTasks();
}


function closeModal() {
  renderallTasks();
  document.getElementById("modal-overlay").style.display = "none";
}








