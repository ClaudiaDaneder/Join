/**
 * Prevents the default behavior to allow dropping elements.
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Initiates the dragging process by setting data and applying styles.
 * @param {Event} ev - The dragstart event.
 * @param {string} id - The ID of the element being dragged.
 */
function drag(ev, id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("rotating");
    element.style.zIndex = 1000;  // Setzen Sie den z-index hoch genug, um über anderen Elementen zu sein
    element.addEventListener("dragend", () => {
      element.classList.remove("rotating");
      element.style.zIndex = "";  // Setzen Sie den z-index zurück, wenn die Drag-Operation endet
    });
  }
  ev.dataTransfer.setData("id", id);
  ev.dataTransfer.dropEffect = "move";
}

/**
 * Handles the drop event by moving the task element to a new column.
 * @param {Event} ev - The drop event.
 */
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
  renderAllTasks();
  upDateAllDate();
}

/**
 * Determines the target element based on the event's location.
 * @param {Event} ev - The event that triggered the function.
 * @returns {Element} The determined target element.
 */
function determineTargetElement(ev) {
  let targetElement = ev.target.classList.contains("noTask")
    ? ev.target.nextElementSibling
    : ev.target;
  while (targetElement && !targetElement.classList.contains("taskColumn")) {
    targetElement = targetElement.parentElement;
  }
  return targetElement;
}

/**
 * Moves a task element to a specified column.
 * @param {Element} taskElement - The task element to move.
 * @param {Element} targetElement - The target column element.
 */
function moveTaskToColumn(taskElement, targetElement) {
  targetElement.appendChild(taskElement);
}

/**
 * Moves a task to a specified container.
 * @param {Object} task - The task object to move.
 * @param {string} containerId - The ID of the container to move the task to.
 */
function moveTaskToContainer(task, containerId) {
  switch (containerId) {
    case "toDo":
      task["status"] = "toDos";
      toDos.push(task);
      break;
    case "inProgress":
      task["status"] = "inProgress";
      inProgress.push(task);
      break;
    case "awaitFeedback":
      task["status"] = "awaitFeedback";
      awaitFeedback.push(task);
      break;
    case "done":
      task["status"] = "done";
      done.push(task);
      break;
  }
}

/**
 * Updates the task list after a task has been moved.
 * @param {string} taskId - The ID of the task that was moved.
 * @param {string} containerId - The ID of the container to which the task was moved.
 */
function updateTaskList(taskId, containerId) {
  let taskToMove = findTaskById(taskId);
  if (!taskToMove) return;

  removeTaskFromCurrentList(taskToMove);
  moveTaskToContainer(taskToMove, containerId);
}

/**
 * Finds a task by its ID.
 * @param {string} taskId - The ID of the task to find.
 * @returns {Object} The found task object.
 */
function findTaskById(taskId) {
  return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(
    (task) => task["task-id"] == taskId
  );
}

/**
 * Removes a task from its current list.
 * @param {Object} taskToRemove - The task object to remove.
 */
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
