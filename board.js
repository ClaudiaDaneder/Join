/**
 * Initializes the Board application.
 * Calls functions to render the task list, include HTML, enable drag-and-drop, and check for empty containers.
 *
 * @function
 * @name init
 */
function init() {
    renderTaskList();
    includeHTML();
    enableDragAndDrop();
    openAndCloseNoTask();
  }
  
  /**
   * Renders the ToDo list by adding HTML elements for each task in the "toDo" container.
   *
   * @function
   * @name renderTaskList
   * @returns {void}
   */
  function renderTaskList() {
    let container = document.getElementById("toDo");
    container.innerHTML = "";
  
    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      currentTask = task["id"];
      const taskHtml = createTaskHtml(task, i);
      container.innerHTML += taskHtml;
    }
  }
  
  /**
   * Opens or closes the "NoTask" containers based on whether the associated task containers are empty or not.
   *
   * @function
   * @name openAndCloseNoTask
   * @returns {void}
   */
  function openAndCloseNoTask() {
    let toDo = document.getElementById("toDo");
    let inProgress = document.getElementById("inProgress");
    let awaitFeedback = document.getElementById("awaitFeedback");
    let done = document.getElementById("done");
  
    document.getElementById("noTaskToDo").style.display = toDo.innerHTML === "" ? "" : "none";
    document.getElementById("noTaskInProgress").style.display = inProgress.innerHTML === "" ? "" : "none";
    document.getElementById("noTaskAwaitFeedback").style.display = awaitFeedback.innerHTML === "" ? "" : "none";
    document.getElementById("noTaskDone").style.display = done.innerHTML === "" ? "" : "none";
  }
  
  /**
   * Creates HTML for a task based on task information and index.
   *
   * @function
   * @name createTaskHtml
   * @param {Object} task - Task information.
   * @param {number} i - Task index.
   * @returns {string} - Generated HTML for the task.
   */
  function createTaskHtml(task, i) {
    let categoryValue = task["category"].split(" ");
    let firstWord = categoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `
          <div class="task" id="${i}">
            <div class="${categoryClass}">${task["category"]}</div>
            <div class="previewTitle">${task["title"]}</div>
            <div class="previewDescription">${task["description"]}</div>
          </div>
          `;
  }
  
  /**
   * Searches for tasks based on the search value in title, description, and category, and returns the result array.
   *
   * @function
   * @name searchTasks
   * @returns {Array} - Array with search results.
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
    console.log(matchingTasks);
    return matchingTasks;
  }
  
  /**
   * Enables drag-and-drop functionality for tasks and containers.
   *
   * @function
   * @name enableDragAndDrop
   * @returns {void}
   */
  function enableDragAndDrop() {
    /**
     * Adds event listeners for drag-and-drop functionality to the container.
     *
     * @function
     * @name addDragAndDropListeners
     * @param {HTMLElement} container - Container for which drag-and-drop is enabled.
     * @returns {void}
     */
    function addDragAndDropListeners(container) {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        container.classList.add("drag-over");
        const draggedTask = document.querySelector(".dragging");
        if (draggedTask && container !== draggedTask.parentElement) {
          container.appendChild(draggedTask);
        }
      });
  
      container.addEventListener("dragleave", () => {
        container.classList.remove("drag-over");
      });
  
      container.addEventListener("drop", (e) => {
        e.preventDefault();
        container.classList.remove("drag-over");
        const draggedTask = document.querySelector(".dragging");
        if (draggedTask && container !== draggedTask.parentElement) {
          container.appendChild(draggedTask);
          updateTaskStatus(draggedTask.id, container.id);
        }
      });
    }
  
    /**
     * Updates the status of a task after drag-and-drop.
     *
     * @function
     * @name updateTaskStatus
     * @param {string} taskId - ID of the moved task.
     * @param {string} containerId - ID of the target container.
     * @returns {void}
     */
    function updateTaskStatus(taskId, containerId) {
      console.log("taskId=" + taskId, "containerId=" + containerId);
    }
  
    /**
     * Enables dragging of tasks.
     *
     * @function
     * @name enableTaskDragging
     * @param {HTMLElement} task - Task to be enabled.
     * @returns {void}
     */
    function enableTaskDragging(task) {
      task.setAttribute("draggable", true);
      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
        task.classList.add("dragging");
      });
      task.addEventListener("dragend", () => {
        tasks.forEach((t) => t.classList.remove("dragging"));
      });
    }
  
    const taskContainers = document.querySelectorAll(".taskColumn");
    taskContainers.forEach(addDragAndDropListeners);
  
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(enableTaskDragging);
  }
  