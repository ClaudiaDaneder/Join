/**
 * Finds a task by its ID in the allDownloadTasks array.
 * @param {number|string} taskId - The ID of the task to find.
 * @returns {Object|null} The found task object or null if no task is found.
 */
function findTaskById(taskId) {
  return allDownloadTasks.find(
    (element) => parseInt(element["task-id"]) === parseInt(taskId)
  );
}


/**
 * Opens and displays the task modal for the given task ID.
 * @param {number|string} taskId - The ID of the task to open.
 */
async function openCurrentTask(taskId) {
  const { modalOverlay, modulWindow } = initializeDomElements();
  modulWindow.innerHTML = "";
  modalOverlay.classList.remove('hide');
  modulWindow.classList.remove('animation-slide-out');
  setTimeout(function () {
    modulWindow.classList.remove('hide');
    modulWindow.classList.add('animation-slide-in');
  }, 100);

  const task = findTaskById(taskId);
  if (!task) {
    handleNoTaskFound();
    return;
  }
  currentSubTasks = task["subtasks"];
  const subTasksHtml = createSubtasksHtml(task["subtasks"]);
  const assigneeHtml = createAssigneeHtml(task["assignee-infos"]);
  const editAssigneeHtml = editAssignee(task["assignee-infos"]);
  modulWindow.innerHTML = await generateTaskHtml(task, assigneeHtml, subTasksHtml, editAssigneeHtml);

  document.getElementById('urgent').addEventListener('click', () => updatePriority('urgent', task));
  document.getElementById('medium').addEventListener('click', () => updatePriority('medium', task));
  document.getElementById('low').addEventListener('click', () => updatePriority('low', task));
}


/**
 * Initializes and returns DOM elements related to the modal overlay and window.
 * @returns {Object} The modal overlay and window DOM elements.
 */
function initializeDomElements() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modulWindow = document.getElementById("modal-window");
  return { modalOverlay, modulWindow };
}


document.addEventListener("DOMContentLoaded", (event) => {
  let modalWindow = document.getElementById("modal-window");
  if (modalWindow) {
    modalWindow.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
});


/**
 * Toggles the checked state of a subtask.
 * @param {number} i - The index of the subtask to toggle.
 */
function changeSubBox(i) {
  var checkBox = document.getElementById("checkBox_" + i);
  if (checkBox) {
    if (currentSubTasks[i].done) {
      checkBox.src = "./img/none-checked.svg";
      currentSubTasks[i].done = false;
    } else {
      checkBox.src = "./img/checked_box.svg";
      currentSubTasks[i].done = true;
    }
  }
  upDateAllDate();
}


/**
 * Closes the current task modal.
 */
function closeCurrentTask() {
  closeModal();
}


/**
 * Deletes a task from the allDownloadTasks array and updates local storage.
 * @param {number|string} taskId - The ID of the task to delete.
 */
async function deletThisArray(taskId) {
  let foundIndex = -1;
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]["task-id"] === taskId) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex !== -1) {
    allDownloadTasks.splice(foundIndex, 1);
    await setItem("allTasks", allDownloadTasks);
    console.log(`Task with ID ${taskId} has been deleted.`);
  } else {
    console.log(`Task with ID ${taskId} was not found.`);
  }
  closeCurrentTask();
  await init();
}
