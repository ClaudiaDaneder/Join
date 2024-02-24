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
  
  
function findTaskById(taskId) {
    return [...toDos, ...inProgress, ...awaitFeedback, ...done].find(
      (task) => task["task-id"] == taskId
    );
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
  
  