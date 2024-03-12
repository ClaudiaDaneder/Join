/**
 * Generates a CSS class name based on the first word of a category.
 * @param {string} category - The category to extract the class name from.
 * @returns {string} The generated class name.
 */
function getCategoryClass(category) {
  let firstWord = category.split(" ")[0];
  return firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
}


/**
 * Calculates the progress percentage of completed subtasks.
 * @param {Array} allSubtasks - An array of subtask objects.
 * @returns {string} The percentage of completed subtasks as a string.
 */
function calculateSubtaskProgress(allSubtasks) {
  let completedSubtasks = allSubtasks.filter(subtask => subtask.done).length;
  let percentage = allSubtasks.length > 0 ? Math.round((completedSubtasks / allSubtasks.length) * 100) : 0;
  return percentage + "%";
}


/**
 * Creates HTML for a progress bar based on subtask completion.
 * @param {string} subtaskPercentage - The percentage of completed subtasks.
 * @param {number} completedSubtasks - The count of completed subtasks.
 * @param {number} totalSubtasks - The total count of subtasks.
 * @returns {string} The HTML string for the progress bar.
 */
function createProgressBar(subtaskPercentage, completedSubtasks, totalSubtasks) {
  if (totalSubtasks > 0) {
    return `
      <div class="ProgressBar-container">
        <div class="ProgressBarBox">
          <div id="progressbar" style='width:${subtaskPercentage}!important;'></div>
        </div>
        <h3 class="progressString">${completedSubtasks} / ${totalSubtasks} Subtasks</h3>
      </div>
    `;
  } else {
    return '';
  }
}


/**
 * Generates HTML for displaying assignee information.
 * @param {Object} task - The task object containing assignee information.
 * @returns {string} The HTML string representing the assignees.
 */
function getAssigneeHtml(task) {
  let assigneeHtmlBoard = '';
  const assign = task["assignee-infos"];
  for (let m = 0; m < assign.length; m++) {
    const element = assign[m];
    const name = element["name"];
    const color = element["color"];
    const initials = name.split(' ').map(n => n[0]).join('');

    assigneeHtmlBoard += `
        <div class="initial-container-on-board-tasks">
          <div class="color-initial-on-board-tasks ${color}">
            <div class="initials-first-and-last-on-board-tasks">${initials}</div>
          </div>
        </div>`;
  }
  return assigneeHtmlBoard;
}


/**
 * Constructs the HTML structure for a task element.
 * @param {Object} task - The task object.
 * @param {string} taskId - The ID of the task.
 * @param {boolean} isHighlighted - Whether the task is highlighted or not.
 * @returns {string} The HTML string representing the task.
 */
function createTaskHtml(task, taskId, isHighlighted) {
  let taskClass = isHighlighted ? "task highlight" : "task hidden";
  let categoryClass = getCategoryClass(task.category);
  let subtaskPercentage = calculateSubtaskProgress(task["subtasks"]);
  let progressBarHtml = createProgressBar(subtaskPercentage, task["subtasks"].filter(subtask => subtask.done).length, task["subtasks"].length);
  let prioHTML = createPrioContainer(task);
  let assigneeHtmlBoard = getAssigneeHtml(task);
  

  return `
      <div class="${taskClass}" onclick="openCurrentTask('${taskId}')" draggable="true" ondragstart="drag(event, '${taskId}')" id="${taskId}">
        <div class="${categoryClass}">${task.category}</div>
        <div class="previewTitle">${task.title}</div>
        <div class="previewDescription">${task.description}</div>
        ${progressBarHtml}
        <div class="icon-and-prio-container">
          <div class="assignees">${assigneeHtmlBoard}</div>
          <div class="prio"> ${prioHTML}</div>
        </div>
      </div>
    `;
}


/**
 * Creates an image element for the task's priority.
 * @param {Object} prio - The priority object of the task.
 * @returns {string} The HTML string for the priority image.
 */
function createPrioContainer(prio) {
  let currentPrio = prio["prio"];

  let imagePath;
  if (currentPrio === "low") {
    imagePath = "../img/addtask_prio_low.svg";
  } else if (currentPrio === "medium") {
    imagePath = "../img/addtask_prio_medium.svg";
  } else if (currentPrio === "urgent") {
    imagePath = "../img/addtask_prio_urgent.svg";
  } else {

  }

  return `<img src="${imagePath}">`;
}


/**
 * Generates HTML for assignees in a more detailed format.
 * @param {Array} assignees - An array of assignee objects.
 * @returns {string} The HTML string representing detailed assignees.
 */
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
                  <div class="initials-first-and-last">${initials}</div>
              </div>
              <div class="assignee">${assigneeName}</div>
          </div>`;
  }

  return html;
}


/**
 * Prepares HTML for editing assignee information.
 * @param {Array} assignees - An array of assignee objects.
 * @returns {string} The HTML string for editable assignee elements.
 */
function editAssignee(assignees) {
  if (!Array.isArray(assignees)) {
    return "";
  }
  selectedContacts = [];
  let html = "";
  for (let i = 0; i < assignees.length; i++) {
    let assigneeObj = assignees[i];
    selectedContacts.push(assigneeObj);
    let assigneeName = assigneeObj.name;
    let initials = getInitials(assigneeName);
    html += `
          <div class="initial-and-name">
              <div class="initials ${assigneeObj.color}">
                  <div class="initials-first-and-last">${initials}</div>
              </div>
          </div>`;
  }

  return html;
}


/**
 * Extracts the initials from a full name.
 * @param {string} name - The full name to extract initials from.
 * @returns {string} The initials extracted from the name.
 */
function getInitials(name) {
  let initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials.length > 1 ? initials : initials + " ";
}


/**
 * Formats a date string into DD-MM-YYYY format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDateToDDMMYYYY(dateString) {
  const parts = dateString.split("-");
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}


/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Generates the HTML for subtasks within a task.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function generateSubTasksHtml(id) {
  let editSubTasksHtml = document.getElementById('renderSubTasks');
  editSubTasksHtml.innerHTML = '';
  subtasks = [];
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]['task-id'] == id) {
      for (let j = 0; j < allDownloadTasks[i]['subtasks'].length; j++) {
        const element = allDownloadTasks[i]['subtasks'][j];
        subtasks.push(element);

        const subTaskText = element["subtasktext"];

        let w = parseInt(window.innerWidth)
        if (w > 500) {
        editSubTasksHtml.innerHTML += `<div class="subtasklist-item" id="subtasklist-item_${j}" ondblclick="editSubtasklistItem(${j}, ${id})" onmouseenter="showEditButtons(${j})" onmouseleave="showEditButtons(${j})">
                          <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subTaskText}</div>
                          <div id="edit-buttons_${j}" class="subtaskfield-button-container hide">
                              <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${j}, ${id})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
                              <img src="/img/delet-edit-line.png">
                              <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklist(${j}, ${id})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                          </div>
                       </div>`;
        } else {
          editSubTasksHtml.innerHTML += `<div class="subtasklist-item" id="subtasklist-item_${j}" ondblclick="editSubtasklistItem(${j}, ${id})">
                          <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subTaskText}</div>
                          <div id="edit-buttons_${j}" class="subtaskfield-button-container">
                              <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${j}, ${id})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
                              <img src="/img/delet-edit-line.png">
                              <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklist(${j}, ${id})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                          </div>
                       </div>`;
        }
      }

    }
  }
}


/**
 * Deletes a subtask from a task.
 * @param {number} j - The index of the subtask to delete.
 * @param {string} taskId - The ID of the task.
 * @returns {void}
 */
function deleteSubtasklist(j, taskId) {
  subtasks.splice(j, 1);
  for (let i = 0; i < allDownloadTasks.length; i++) {
    allSubtasks
  }
  setItem('allTasks', allDownloadTasks);
  openCurrentTask(taskId);
  editTask();
}


/**
 * Updates the popup window for editing a subtask.
 * @param {number} j - The index of the subtask to update.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function updateEditPopup(j, id) {
  let subtext = document.getElementById('editfield');
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]['task-id'] == id) {
      allDownloadTasks[i]['subtasks'][j]['subtasktext'] = subtext.value;
    }
  }
  setItem('allTasks', allDownloadTasks);
  generateSubTasksHtml(id)
  editTask();
}


/**
 * Updates the priority of a task.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newPriority - The new priority to set.
 * @returns {void}
 */
function updateTaskPriority(taskId, newPriority) {
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]['task-id'] == taskId) {
      allDownloadTasks[i]['prio'] = newPriority;
      break;
    }
  }
  setItem('allTasks', allDownloadTasks);
  openCurrentTask(taskId);
}


/**
 * Adds a new subtask to a task.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function setNewSubTask(id) {
  let subtext = document.getElementById('subtasks');
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]['task-id'] == id) {
      allDownloadTasks[i]['subtasks'].push({ 'subtasktext': subtext.value, 'done': false });
    }
  }
  setItem('allTasks', allDownloadTasks);
  generateSubTasksHtml(id)
  clearSubtaskField();
}


/**
 * Updates and saves the task details based on user input from the editing interface.
 * @param {string} id - The ID of the task to be edited.
 */
function editCurrentTask(id) {
  let title = document.getElementById("titleEditValue").value;
  let description = document.getElementById("descriptionEditValue").value;
  let dueDate = document.getElementById("due-date").value;

  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]["task-id"] == id) {
      allDownloadTasks[i]["title"] = title;
      allDownloadTasks[i]["description"] = description;
      allDownloadTasks[i]["due-date"] = dueDate;
      
      // Überprüfen, ob neue Kontakte ausgewählt wurden, bevor sie zugewiesen werden
      if (selectedContacts.length > 0) {
        allDownloadTasks[i]["assignee-infos"] = selectedContacts;
      }
    }
  }
  setItem('allTasks', allDownloadTasks);
  renderAllTasks();
  openCurrentTask(id);
}


/**
 * Updates the selected contacts based on user interaction in the contact assignment interface.
 * @returns {Array} - An array of selected contacts.
 */
function updateSelectedContacts() {
  let selectedContacts = []; 
  const checkboxes = document.querySelectorAll('#assignee .checkbox-option');

  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    const img = checkbox.querySelector('img');
    if (img && img.src.includes('addtask_contacts_checkbox_checked.svg')) {
        selectedContacts.push(checkbox);
    }
  }
  return selectedContacts;
}


/**
 * Generates and returns HTML content for a task based on its details and associated HTML for assignees and subtasks.
 * @param {Object} task - The task object containing all the details.
 * @param {string} assigneeHtmlBoard - HTML content for the assignees of the task.
 * @param {string} subTasksHtml - HTML content for the subtasks of the task.
 * @param {string} editAssigneeHtml - HTML content for editing assignee information.
 * @returns {Promise<string>} - A promise that resolves to the HTML content for the task.
 */
async function generateTaskHtml(task, assigneeHtmlBoard, subTasksHtml, editAssigneeHtml) {
  const firstPart = task.category.split(" ")[0].toLowerCase();
  const originalDate = task["due-date"];
  const formattedDate = formatDateToDDMMYYYY(originalDate);
  let Prio = capitalizeFirstLetter(task["prio"]);
  let prioimage = createPrioContainer(task)

  return `
    <button onclick="closeModal()" type="button"><img class="close-png" src="./img/close.png"></button>
    <section class="editCurrentTask" id="editCurrentTask" style="display: none;">
    <div class="editCurrentTitle">
    <p class="task-label">Title</p>
      <input class="task-input" type="text" id="titleEditValue" placeholder="Enter a Title" value="${task['title']}" required>
    </div>
    <div class="editCurrentDescription">
    <p class="task-label">Description</p>
      <textarea class="task-input" type="text" id="descriptionEditValue" placeholder="Enter a Description" rows="2">${task['description']}</textarea>
    </div>
    <div class="editCurrentDueDate">
    <p class="task-label">Due date</p>
      <input class="task-input" type="date" id="due-date" required value="${formattedDate}" min="0">
    </div>
    <div class="editCurrentPrio">
      <p class="task-label">Priority</p>
      <div class="prio-button-container">
        <button type="button" class="button-prio-urgent ${task['prio'] === 'urgent' ? 'selected' : ''}" data-priority="urgent" id="urgent">Urgent</button>
        <button type="button" class="button-prio-medium ${task['prio'] === 'medium' ? 'selected' : ''}" data-priority="medium" id="medium">Medium</button>
        <button type="button" class="button-prio-low ${task['prio'] === 'low' ? 'selected' : ''}" data-priority="low" id="low">Low</button>
      </div>
    </div>
    <p class="task-label">Assigned to:</p>
    <div class="dropdown" id="contacts-dropdown" onclick="notClose(event), toggleContactsDropdown(event)">
      <p>Select contacts to assign</p>
      <input class="task-input hide" type="text" id="hidden-contacts-input" oninput="filterContacts()">
      <img src="/img/addtask_icon_dropdown-menu.svg" id="assign-arrow">
      <div class="dropdown-content" id="assignee"  onclick="updateSelectedContacts()"></div>
    </div>
    <div class="icon-and-prio-container">${editAssigneeHtml}</div>
    <p class="task-label">Subtasks:</p>
    <div class="styled-subtaskfield" id="styled-subtaskfield">
        <input class="task-input subtaskfield" type="text" placeholder="Add new subtask" id="subtasks" oninput="updateSubtaskButtons(${task["task-id"]})" onfocus="subtaskfieldFocus()" onblur="subtaskfieldBlur()">
        <div class="subtaskfield-button-container" id="subtaskfield-buttons">
          <button type="button" class="subtaskfield-button-general">
            <img src="/img/addtask_icon_subtaskfield_plus.svg">
          </button>
        </div>
    </div>
    <div id="renderSubTasks"></div>
    
    <div class="editCurrentSubtasks" id="editCurrentSubtasks"></div>
    <button class="create-button right" onclick="editCurrentTask(${task["task-id"]})">Ok</button>
  </section>


  <div class="width-height-full-prozent" id="currentOpenTask">
        <div class="overHeadline">
            <div class="${firstPart}">${task["category"]}</div>
        </div>
        <div class="Headline"><h1 class="current-task-headline">${task["title"]}</h1></div>
        <div class="description"><p class="current-task-description">${task["description"]}</p></div>
        <div class="due-date">Due date: <p>${formattedDate}</p></div>
        <div class="current-prio">Priority: <p>${Prio}</p> ${prioimage}</div>
        <div class="assigne-container" id="assigne">
            Assigned To: 
            ${assigneeHtmlBoard}
        </div>
        <div class="subtasks">
        Subtasks:
        ${subTasksHtml}
        </div>
        <div class="delet-edit-container">
            <div class="delet-edit-box">
                <button class="delete-box" onclick="deletThisArray(${task["task-id"]})">
                <img class="delete-svg" src="./img/delete.svg">
                Delete
                </button>
                <img id="delet-edit-line" src="./img/delet-edit-line.png">
                <button class="edit-box" onclick="editTask(${task["task-id"]}), generateSubTasksHtml(${task["task-id"]})">
                <img class="edit-svg" src="./img/edit.svg">
                Edit
                </button>
            </div>
        </div>
  </div>`;
}


/**
 * Updates the priority of a task when a priority button is clicked.
 * @param {string} priority - The new priority to be set for the task.
 * @param {Object} task - The task object whose priority is to be updated.
 */
function updatePriority(priority, task) {
  const selectedButton = document.getElementById(priority);
  const isSelected = selectedButton.classList.contains('selected');
  const priorities = ['urgent', 'medium', 'low'];
  priorities.forEach(prio => {
    const button = document.getElementById(prio);
    button.classList.remove('selected');
  });

  if (!isSelected) {
    selectedButton.classList.add('selected');
    task['prio'] = priority;
  } else {
    task['prio'] = '';
  }
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]['task-id'] === task['task-id']) {
      allDownloadTasks[i]['prio'] = task['prio'];
      break;
    }
  }
  setItem('allTasks', allDownloadTasks);
}


/**
 * Toggles the display state between the current task view and the task editing interface.
 * @param {string} status - The new status to set for the task editing interface visibility.
 */
async function editTask(status) {
  let currentOpenTask = document.getElementById("currentOpenTask");
  let toEditTask = document.getElementById("editCurrentTask");

  currentOpenTask.style.display = "none";
  toEditTask.style.display = "";
}


/**
 * Creates HTML content for displaying subtasks of a task.
 * @param {Array} subTasks - An array of subtask objects.
 * @returns {string} - The HTML content for the subtasks.
 */
function createSubtasksHtml(subTasks) {
  let subTaskhtml = "";
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i]["subtasktext"];
    let imgSrc = subTasks[i].done ? "./img/checked_box.svg" : "./img/none-checked.svg";
    subTaskhtml += `<div class="subtask-current-box"><img id="checkBox_${i}" onclick="changeSubBox(${i})" src=${imgSrc}>${subTask}</div>`;
  }
  return subTaskhtml;
}


