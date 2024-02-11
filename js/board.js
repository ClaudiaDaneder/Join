
function init() {
    renderTaskList();
    includeHTML();
    openAndCloseNoTask();
  }
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
  
  function openAndCloseNoTask() {
    let toDo = document.getElementById("toDo");
    let inProgress = document.getElementById("inProgress");
    let awaitFeedback = document.getElementById("awaitFeedback");
    let done = document.getElementById("done");
  
    document.getElementById("noTaskToDo").style.display = toDo.innerHTML == "" ? "" : "none";
    document.getElementById("noTaskInProgress").style.display = inProgress.innerHTML == "" ? "" : "none";
    document.getElementById("noTaskAwaitFeedback").style.display = awaitFeedback.innerHTML == "" ? "" : "none";
    document.getElementById("noTaskDone").style.display = done.innerHTML == "" ? "" : "none";
  }


  function createTaskHtml(task, i) {
    let categoryValue = task["category"].split(" ");
    let firstWord = categoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `
          <div class="task" draggable="true" ondragstart="drag(event)" id="task_${i}">
            <div class="${categoryClass}">${task["category"]}</div>
            <div class="previewTitle">${task["title"]}</div>
            <div class="previewDescription">${task["description"]}</div>
          </div>
          `;
  }

  function searchTasks() {
    let searchValue = document.getElementById("searchInput").value;
    let matchingTasks = [];
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i]["title"].toLowerCase().includes(searchValue) ||
          allTasks[i]["description"].toLowerCase().includes(searchValue) ||
          allTasks[i]["category"].toLowerCase().includes(searchValue))
          {
        matchingTasks.push(allTasks[i]);
      }
    }
    return matchingTasks;
  }

  function allowDrop(ev) {
    ev.preventDefault();
    
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    openAndCloseNoTask();
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    openAndCloseNoTask();
  }