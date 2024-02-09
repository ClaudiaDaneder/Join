

function init() {
    renderTaskList("toDo");
    includeHTML();
    openAndCloseNoTask();
}


function renderTaskList(toDo) {
    let container = document.getElementById(toDo);
    container.innerHTML = "";

    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        currentTask = task["id"];
        const taskHtml = createTaskHtml(task);
        container.innerHTML += taskHtml;
        
    }
}
function openAndCloseNoTask(){
    let toDo=document.getElementById("toDo");
    let inProgress= document.getElementById("inProgress");
    let awaitFeedback= document.getElementById("awaitFeedback");
    let done= document.getElementById("done");
    if (toDo.innerHTML=="") {
        document.getElementById("noTaskToDo").style.display="";
    }
    if (inProgress.innerHTML=="") {
        document.getElementById("noTaskInProgress").style.display="";
    }
    if (awaitFeedback.innerHTML=="") {
        document.getElementById("noTaskAwaitFeedback").style.display="";
    }
    if (done.innerHTML=="") {
        document.getElementById("noTaskDone").style.display="";
    }
}

function createTaskHtml(task) {
    let categoryValue = task['category'].split(" ");
    let firstWord =categoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `
        <div class="task">
        <div class="${categoryClass}">${task["category"]}</div>
        <div class="previewTitle">${task["title"]}</div>
        <div class="previewDescription" >${task["description"]}</div>
        </div>
        `;
}


function serchTasks(){
    let searchValue = document.getElementById("searchInput").value;
    let matchingTasks = [];
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i]["title"].toLowerCase().includes(searchValue) || allTasks[i]["description"].toLowerCase().includes(searchValue) || allTasks[i]["category"].toLowerCase().includes(searchValue)) {
        matchingTasks.push(allTasks[i]);
        }
    }
  console.log(matchingTasks);
  return matchingTasks;
}
