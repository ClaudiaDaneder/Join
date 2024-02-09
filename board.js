

function init() {
    renderTaskList("toDo");
    includeHTML();
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