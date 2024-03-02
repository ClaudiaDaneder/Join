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
    return `
      <div class="ProgressBar-container">
        <div class="ProgressBarBox">
          <div id="progressbar" style='width:${subtaskPercentage}!important;'></div>
        </div>
        <h3 class="progressString">${completedSubtasks} / ${totalSubtasks} Subtasks</h3>
      </div>
    `;
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
            <h3 class="initials-first-and-last-on-board-tasks">${initials}</h3>
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
    // Rufen Sie die Hilfsfunktion auf, um die HTML-Zeichenfolge für die Beauftragten zu erhalten
    let assigneeHtmlBoard = getAssigneeHtml(task);
  
    return `
      <div class="task ${taskClass}" onclick="openCurrentTask('${taskId}')" draggable="true" ondragstart="drag(event, '${taskId}')" id="${taskId}">
        <div class="${categoryClass}"><h4 class="categoryHeadlineBoard">${task.category}</h4></div>
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
                  <h3 class="initials-first-and-last">${initials}</h3>
              </div>
              <h3 class="assignee">${assigneeName}</h3>
          </div>`;
    }
  
    return html;
  }


  function editAssignee(assignees) {
    if (!Array.isArray(assignees)) {
      return "";
    }
  
    let html = "";
    for (let i = 0; i < assignees.length; i++) {
      let assigneeObj = assignees[i];
      let assigneeName = assigneeObj.name;
      let initials = getInitials(assigneeName);
      html += `
          <div class="initial-container-on-board-tasks">
              <div class="color-initial-on-board-tasks ${assigneeObj.color}">
                  <h3 class="initials-first-and-last-on-board-tasks">${initials}</h3>
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
    return initials.length > 1 ? initials : initials + " "; // Fügt ein Leerzeichen hinzu, falls nur ein Initial vorhanden ist
  }
  

  function formatDateToDDMMYYYY(dateString) {
    const parts = dateString.split("-");
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
}


function generateSubTasksHtml(allSubtasks, id) {
  let editSubTasksHtml = '';
  console.log(allSubtasks);
  subtasks = [];
  for (let j = 0; j < allSubtasks.length; j++) {
      const element = allSubtasks[j];
      subtasks.push(element);
      
      const subTaskText = element["subtasktext"];
      editSubTasksHtml += `<div class="subtasklist-item" id="subtasklist-item_${j}" ondblclick="editSubtasklistItem(${j}, ${id})" onmouseenter="showEditButtons(${j})" onmouseleave="showEditButtons(${j})">
                          <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subTaskText}</div>
                          <div id="edit-buttons_${j}" class="subtaskfield-button-container hide">
                              <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${j}, ${id})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
                              <hr>
                              <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklist(${j}, ${id})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                          </div>
                       </div>`;
  }
  return editSubTasksHtml;
}


function deleteSubtasklist(j, taskId){
  subtasks.splice(j, 1);
  for (let i = 0; i < allDownloadTasks.length; i++){
    if(allDownloadTasks[i]['task-id'] == taskId){
      allDownloadTasks[i]['subtasks'] = subtasks;
    }
  }
  setItem('allTasks', allDownloadTasks);
  openCurrentTask(taskId);
  editTask();
}


function updateEditPopup(j, id){
  let subtext = document.getElementById('editfield');
  for (let i = 0; i < allDownloadTasks.length; i++){
    if(allDownloadTasks[i]['task-id'] == id){
      allDownloadTasks[i]['subtasks'][j]['subtasktext'] = subtext.value;
    }
  }
  setItem('allTasks', allDownloadTasks);
    openCurrentTask(id);
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


function setNewSubTask(id){
  let subtext = document.getElementById('subtasks');
  for (let i = 0; i < allDownloadTasks.length; i++){
    if(allDownloadTasks[i]['task-id'] == id){
      allDownloadTasks[i]['subtasks'].push({ 'subtasktext': subtext.value, 'done': false });
    }
  }
    setItem('allTasks', allDownloadTasks);
    openCurrentTask(id);
    editTask();
}


function generateTaskHtml(task, assigneeHtmlBoard, subTasksHtml,editAssigneeHtml) {
  const firstPart = task.category.split(" ")[0].toLowerCase();
  const originalDate = task["due-date"]; 
  const formattedDate = formatDateToDDMMYYYY(originalDate); 
  const subTasks = generateSubTasksHtml(task["subtasks"], task["task-id"]);
  return `
    <form onsubmit="editCurrentTask()" class="editCurrentTask" id="editCurrentTask" style="display: none;">
    <div class="editCurrentTitle">
      <h3 class="sectionHeadInfos">Title<h3>
      <input type="text" placeholder="Enter a Title" value="${task['title']}">
    </div>
    <div class="editCurrentDescription">
      <h3 class="sectionHeadInfos">Description<h3>
      <input type="text" placeholder="Enter a Description" value="${task['description']}">
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
    <div class="editCurrentAssigncloseMo
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
    ${subTasks}
    <div class="editCurrentSubtasks" id="editCurrentSubtasks"> </div>
    <button>Ok</button>
  </form>


  <div class="width-height-full-prozent" id="currentOpenTask">
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
            ${assigneeHtmlBoard}
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
                <div  class="edit-box" onclick="editTask(${task["task-id"]})">
                <div class=""><img class="edit-svg" src="./img/edit.svg"></div>
                <div class="" ><h4 class="edit-string">Edit</h4></div>
                </div>
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
    let currentOpenTask=document.getElementById("currentOpenTask");
    let toEditTask = document.getElementById("editCurrentTask");
  
    currentOpenTask.style.display="none";
    toEditTask.style.display="";
    
    
     }

function createSubtasksHtml(subTasks) {
    let subTaskhtml = "";
    for (let i = 0; i < subTasks.length; i++) {
      let subTask = subTasks[i]["subtasktext"];
      let imgSrc = subTasks[i].done ? "./img/checked.png" : "./img/none-checked.png";
      subTaskhtml += `<div class="subtask-current-box"><img id="checkBox_${i}" onclick="changeSubBox(${i})" src=${imgSrc}><h4 class="subtask-font">${subTask}</h4></div>`;
    }
    return subTaskhtml;
  }

  
  