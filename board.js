

function init() {
    renderTaskList();
    includeHTML();
    
    enableDragAndDrop();
    openAndCloseNoTask();
}


function renderTaskList() {
    let container = document.getElementById("toDo");
    container.innerHTML = "";

    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        currentTask = task["id"];
        const taskHtml = createTaskHtml(task,i);
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
    if (toDo.innerHTML !="") {
        document.getElementById("noTaskToDo").style.display="none";
    }
    if (inProgress.innerHTML=="") {
        document.getElementById("noTaskInProgress").style.display="";
    }
    if (inProgress.innerHTML !="") {
        document.getElementById("noTaskToDo").style.display="none";
    }
    if (awaitFeedback.innerHTML=="") {
        document.getElementById("noTaskAwaitFeedback").style.display="";
    }
    if (done.innerHTML=="") {
        document.getElementById("noTaskDone").style.display="";
    }
}

function createTaskHtml(task,i) {
    let categoryValue = task['category'].split(" ");
    let firstWord =categoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `
        <div class="task" id="${i}">
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


function enableDragAndDrop() {
    const taskContainers = document.querySelectorAll(".taskColumn");

    taskContainers.forEach(container => {
        container.addEventListener("dragover", (e) => {
            e.preventDefault();

            // Hier wird der Container hervorgehoben, um anzuzeigen, dass das Element hier abgelegt werden kann
            container.classList.add("drag-over");

            const draggedTask = document.querySelector(".dragging");

            if (draggedTask && container !== draggedTask.parentElement) {
                container.appendChild(draggedTask);
            }
        });

        container.addEventListener("dragleave", () => {
            // Hier wird die Hervorhebung des Containers entfernt, wenn das Element den Container verlässt
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
    });

    const tasks = document.querySelectorAll(".task");

    tasks.forEach(task => {
        task.setAttribute("draggable", true);

        task.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", task.id);
            task.classList.add("dragging");
        });

        task.addEventListener("dragend", () => {
            tasks.forEach(t => t.classList.remove("dragging"));
        });
    });
}


function updateTaskStatus(taskId, newStatus) {
    // Hier kannst du die Logik für die Aktualisierung des Task-Status implementieren
    // Zum Beispiel: Finde den Task mit der taskId in deinem Datenmodell und aktualisiere den Status
    console.log(`Task ${taskId} moved to ${newStatus}`);
    openAndCloseNoTask();
}