let currentTask;
let toDos = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let allDownloadTasks = [];
let currentSubTasks = [];
let boardSubTask = [];
let searchResults = [];


/**
 * Initializes the task board by loading tasks from storage, filling categories, and rendering tasks.
 */
async function init() {
  await includeHTML();
  await loadTaskFromStorage();
  await fillTasks();
  renderAllTasks();
  initOnline();
  enableNavigation();
  navigation('show');
}


/**
 * Opens the add task modal for creating a new task.
 * @param {string} status - The initial status of the new task.
 */
function openAddTask(status) {
  let w = parseInt(window.innerWidth)
  if (w > 850) {
    resetForm();
    document.getElementById('my-form').value = status;
    document.getElementById("addTaskContainerBG").classList.remove('hide');
    document.getElementById('addTaskContainer').classList.remove('animate-slide-out');
    setTimeout(function () {
      document.getElementById("addTaskContainer").classList.remove('hide');
      document.getElementById('addTaskContainer').classList.add('animate-slide-in');
    }, 100)
  } else {
    setTimeout(function () {
      window.location.href = 'addtask.html';
    }, 900);
  }
}


/**
 * Closes the add task modal.
 */
function closeAddTask() {
  document.getElementById('my-form').value = '';
  document.getElementById('addTaskContainer').classList.remove('animate-slide-in');
  document.getElementById('addTaskContainer').classList.add('animate-slide-out');
  setTimeout(function () {
    document.getElementById("addTaskContainer").classList.add('hide');
    document.getElementById("addTaskContainerBG").classList.add('hide');
  }, 500);
}


/**
 * Loads tasks from local storage and updates the allDownloadTasks array.
 */
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


/**
 * Categorizes tasks into their respective statuses.
 */
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


/**
 * Renders all tasks into their respective columns based on their status.
 */
function renderAllTasks() {
  renderTasks(toDos, "toDo");
  renderTasks(inProgress, "inProgress");
  renderTasks(awaitFeedback, "awaitFeedback");
  renderTasks(done, "done");
  openAndCloseNoTask();
}


/**
 * Renders tasks in a specific container.
 * @param {Array} tasksArray - The array of tasks to be rendered.
 * @param {string} containerId - The ID of the container where tasks should be rendered.
 */
function renderTasks(tasksArray, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < tasksArray.length; i++) {
    let task = tasksArray[i];
    let isHighlighted = searchResults.length === 0 || searchResults.includes(task["task-id"]);
    if (isHighlighted) {
      const taskHtml = createTaskHtml(task, task["task-id"], true);
      container.innerHTML += taskHtml;
    }
  }
}


/**
 * Toggles visibility of 'no task' indicators based on task presence in each category.
 */
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


/**
 * Updates the allDownloadTasks array based on current task status categories.
 */
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


/**
 * Filters tasks based on user input in the search field and updates the display.
 */
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

  renderAllTasks();
}


/**
 * Resets the search field and renders all tasks.
 */
function endSearch() {
  document.getElementById("searchInput").value = "";
  searchResults = [];
  renderAllTasks();
}


/**
 * Closes the modal window.
 */
function closeModal() {
  renderAllTasks();
  document.getElementById('modal-window').classList.remove('animation-slide-in');
  document.getElementById('modal-window').classList.add('animation-slide-out');
  setTimeout(function () {
    document.getElementById('modal-window').classList.add('hide');
    document.getElementById('modal-overlay').classList.add('hide')
    document.getElementById('modal-window').innerHTML = '';
  }, 500);
}


/**
 * Adds focus styling to the search field.
 */
function searchfieldFocus() {
  document.getElementById('inputField').classList.toggle('subtaskfield-focus')
}


/**
 * Removes focus styling from the search field.
 */
function searchfieldBlur() {
  document.getElementById('inputField').classList.remove('subtaskfield-focus')
}


/**
 * Closes the dropdown if it's open when user clicks outside of it.
 */
function closeInput() {
  if (doc('contacts-dropdown').classList.contains('active')) {
    doc('contacts-dropdown').classList.remove('active');
    doc('assign-arrow').style.transform = 'rotate(0deg)';
  }
}


/**
 * Prevents the dropdown from closing when clicked inside.
 * @param {Event} event - The DOM event.
 */
function notClose(event) {
  event.stopPropagation();
}


/**
 * Closes the add task modal when clicking outside the modal content.
 */
window.addEventListener('click', function(e){
  if (e.target.id == 'addTaskContainerBG') {
    if (doc('addTaskContainer').classList.contains('animate-slide-in')) {
      doc('addTaskContainer').classList.remove('animate-slide-in');
      doc('addTaskContainer').classList.add('animate-slide-out');
      setTimeout(() => {
        doc('addTaskContainerBG').classList.add('hide');
        doc('addTaskContainer').classList.add('hide');
      }, 300);
    }
  }
});  