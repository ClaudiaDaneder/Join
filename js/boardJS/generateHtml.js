function getCategoryClass(category) {
    let firstWord = category.split(" ")[0];
    return firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
  }
  
  
  function calculateSubtaskProgress(subtasks) {
    let completedSubtasks = subtasks.filter(subtask => subtask.done).length;
    let percentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
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
  
  
  function createTaskHtml(task, taskId, isHighlighted,prio) {
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
  function generateTaskHtml(task, assigneeHtmlBoard, subTasksHtml) {
    const firstPart = task.category.split(" ")[0].toLowerCase();
    const originalDate = task["due-date"]; 
    const formattedDate = formatDateToDDMMYYYY(originalDate); 
    return `
        <form class="editCurrentTask" id="editCurrentTask" style="display: none;">
          <div class="editCurrentTitle">
            <h3 class="sectionHeadInfos">Title<h3>
            <input type="text" value="${task['title']}">
          </div>
          <div class="editCurrentDescription">
            <h3 class="sectionHeadInfos">Description<h3>
            <input type="text" value="${task['description']}">
          </div>
          <div class="editCurrentDueDate">
            <h3 class="sectionHeadInfos">Due date<h3>
            <input class="task-input" type="date" id="due-date" required="" value="${formattedDate}" min="0">
          </div>
          <div class="editCurrentPrio">
            <h3 class="sectionHeadInfos">Priority<h3>
            <div class="prio-button-container">
                        <button type="button" class="button-prio-urgent" data-priority="urgent">Urgent </button>
                        <button type="button" class="button-prio-medium selected" data-priority="medium">Medium</button>
                        <button type="button" class="button-prio-low" data-priority="low">Low</button>
                    </div>
          </div>
          <div class="editCurrentAssignedTo">
            <h3 class="sectionHeadInfos">Assigned to<h3>
            
            ${assigneeHtmlBoard}
          </div>
          <div class="editCurrentSubtasks">
            <div></div>
            <div></div> 
          </div>
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
        </div>
        `;
  }

  async function editTask(taskId) {
    let currentOpenTask=document.getElementById("currentOpenTask");
    let toEditTask = document.getElementById("editCurrentTask");
  
    currentOpenTask.style.display="none";
    toEditTask.style.display="";
    console.log(taskId)
  
    
     }
  
  

function createSubtasksHtml(subTasks) {
    let subTaskhtml = "";
    for (let i = 0; i < subTasks.length; i++) {
      let subTask = subTasks[i]["subtasktext"];
      let imgSrc = subTasks[i].done ? "./img/checked.png" : "./img/none-checked.png"; // Bestimmen des Bildpfads basierend auf dem done-Status
      subTaskhtml += `<div class="subtask-current-box"><img id="checkBox_${i}" onclick="changeSubBox(${i})" src=${imgSrc}><h4 class="subtask-font">${subTask}</h4></div>`;
    }
    return subTaskhtml;
  }

  
  