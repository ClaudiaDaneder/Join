function getCategoryClass(category) {
  let firstWord = category.split(" ")[0];
  return firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
}


function calculateSubtaskProgress(allSubtasks) {
  let completedSubtasks = allSubtasks.filter(subtask => subtask.done).length;
  let percentage = allSubtasks.length > 0 ? Math.round((completedSubtasks / allSubtasks.length) * 100) : 0;
  return percentage + "%";
}


function createProgressBar(subtaskPercentage, completedSubtasks, totalSubtasks) {
  if (totalSubtasks.length > 0) {
    return `
      <div class="ProgressBar-container">
        <div class="ProgressBarBox">
          <div id="progressbar" style='width:${subtaskPercentage}!important;'></div>
        </div>
        <h3 class="progressString">${completedSubtasks} / ${totalSubtasks} Subtasks</h3>
      </div>
    `;
  } else {
    return ''
  }
}


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


function editAssignee(assignees) {
  console.log("Number of assignees:", assignees.length);
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
          <div class="initial-container-on-board-tasks">
              <div class="color-initial-on-board-tasks ${assigneeObj.color}">
                  <div class="initials-first-and-last-on-board-tasks">${initials}</div>
              </div>
          </div>`;
  }

  return html;
}


function getInitials(name) {
  let initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials.length > 1 ? initials : initials + " ";
}


function formatDateToDDMMYYYY(dateString) {
  const parts = dateString.split("-");
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}


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
        editSubTasksHtml.innerHTML += `<div class="subtasklist-item" id="subtasklist-item_${j}" ondblclick="editSubtasklistItem(${j}, ${id})" onmouseenter="showEditButtons(${j})" onmouseleave="showEditButtons(${j})">
                          <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subTaskText}</div>
                          <div id="edit-buttons_${j}" class="subtaskfield-button-container hide">
                              <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${j}, ${id})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
                              <hr>
                              <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklist(${j}, ${id})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                          </div>
                       </div>`;
      }

    }
  }
}


function deleteSubtasklist(j, taskId) {
  subtasks.splice(j, 1);
  for (let i = 0; i < allDownloadTasks.length; i++) {
    allSubtasks
  }
  setItem('allTasks', allDownloadTasks);
  openCurrentTask(taskId);
  editTask();
}


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


function editCurrentTask(id) {

  let title = document.getElementById("titleEditValue").value;
  let description = document.getElementById("descriptionEditValue").value;
  let dueDate = document.getElementById("due-date").value;
  for (let i = 0; i < allDownloadTasks.length; i++) {
    if (allDownloadTasks[i]["task-id"] == id) {
      allDownloadTasks[i]["title"] = title;
      allDownloadTasks[i]["description"] = description;
      allDownloadTasks[i]["due-date"] = dueDate;
      allDownloadTasks[i]["assignee-infos"] = selectedContacts;
      console.log(selectedContacts);
    }

  }

  setItem('allTasks', allDownloadTasks);
  renderallTasks();
  openCurrentTask(id);
}

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




async function generateTaskHtml(task, assigneeHtmlBoard, subTasksHtml, editAssigneeHtml) {
  const firstPart = task.category.split(" ")[0].toLowerCase();
  const originalDate = task["due-date"];
  const formattedDate = formatDateToDDMMYYYY(originalDate);
  return /*html*/`
  
    <section class="editCurrentTask" id="editCurrentTask" style="display: none;">
    <div class="editCurrentTitle">
    <p class="task-label">Title</p>
      <input type="text" id="titleEditValue" placeholder="Enter a Title" value="${task['title']}" required>
    </div>
    <div class="editCurrentDescription">
      <h3 class="sectionHeadInfos">Description<h3>
      <input type="text" id="descriptionEditValue" placeholder="Enter a Description" value="${task['description']}">
    </div>
    <div class="editCurrentDueDate">
      <h3 class="sectionHeadInfos">Due date<h3>
      <input class="task-input" type="date" id="due-date" required="" value="${formattedDate}" min="0">
    </div>
    <div class="editCurrentPrio">
      <h3 class="sectionHeadInfos">Priority<h3>
      <div class="prio-button-container">
      <button type="button" class="button-prio-urgent ${task['prio'] === 'urgent' ? 'selected' : ''}" data-priority="urgent" id="urgent">Urgent</button>
      <button type="button" class="button-prio-medium ${task['prio'] === 'medium' ? 'selected' : ''}" data-priority="medium" id="medium">Medium</button>
      <button type="button" class="button-prio-low ${task['prio'] === 'low' ? 'selected' : ''}" data-priority="low" id="low">Low</button>
      
      </div>
    </div>

    <div class="dropdown" id="contacts-dropdown" onclick="toggleContactsDropdown(event)">
      <p>Select contacts to assign</p>
      <input class="task-input hide" type="text" id="hidden-contacts-input" oninput="filterContacts()">
      <img src="/img/addtask_icon_dropdown-menu.svg" id="assign-arrow">
      <div class="dropdown-content" id="assignee"  onclick="updateSelectedContacts()"></div>
    </div>

    <div class="editCurrentAssigncloseModal>
      <div class="icon-and-prio-container">
        <div class="assignees">${editAssigneeHtml}</div>
      </div>
    </div>
    <div class="styled-subtaskfield" id="styled-subtaskfield">
        <input class="task-input subtaskfield" type="text" placeholder="Add new subtask" id="subtasks" oninput="updateSubtaskButtons(${task["task-id"]})" onfocus="subtaskfieldFocus()" onblur="subtaskfieldBlur()">
        <div class="subtaskfield-button-container" id="subtaskfield-buttons">
          <button type="button" class="subtaskfield-button-general">
            <img src="/img/addtask_icon_subtaskfield_plus.svg">
          </button>
        </div>
    </div>
    <div id="renderSubTasks"></div>
    
    <div class="editCurrentSubtasks" id="editCurrentSubtasks"> </div>
    <button onclick="editCurrentTask(${task["task-id"]})">Ok</button>
  </section>


  <div class="width-height-full-prozent" id="currentOpenTask">
        <div class="overHeadline">
            <div class="${firstPart}">${task["category"]}</div>
            <div><img onclick="closeModal()" class="close-png" src="./img/close.png" alt=""></div>
        </div>
        <div class="Headline"><h1 class="current-task-headline">${task["title"]}</h1></div>
        <div class="description"><p class="current-task-description">${task["description"]}</p></div>
        <div class="due-date">Due date: <p>${task["due-date"].replace(/-/g, "/")}</p></div>
        <div class="current-prio">Priority: <p>${task["prio"]}</p></div>
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
                <img src="./img/delet-edit-line.png">
                <button class="edit-box" onclick="editTask(${task["task-id"]}), generateSubTasksHtml(${task["task-id"]})">
                <img class="edit-svg" src="./img/edit.svg">
                Edit
                </button>
            </div>
        </div>
  </div>`;
}

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



async function editTask(status) {
  let currentOpenTask = document.getElementById("currentOpenTask");
  let toEditTask = document.getElementById("editCurrentTask");

  currentOpenTask.style.display = "none";
  toEditTask.style.display = "";


}

function createSubtasksHtml(subTasks) {
  let subTaskhtml = "";
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i]["subtasktext"];
    let imgSrc = subTasks[i].done ? "./img/checked.png" : "./img/none-checked.png";
    subTaskhtml += `<div class="subtask-current-box"><img id="checkBox_${i}" onclick="changeSubBox(${i})" src=${imgSrc}>${subTask}</div>`;
  }
  return subTaskhtml;
}


