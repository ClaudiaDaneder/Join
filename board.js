let tasks=[
    {"category":"User Story",
    "title":"Titel",
    "description":"description",
    "dueDate":"1.1.1974",
    "priority":"Medium",
    "contacts":"Max Mustermann",
    "id":0},

    {"category":"Technical Task",
    "title":"Titel",
    "description":"description",
    "dueDate":"1.1.1974",
    "priority":"Medium",
    "contacts":"Mark Mustermann",
    "id":1},

    {"category":"Technical Task",
    "title":"Titel",
    "description":"description",
    "dueDate":"1.1.1974",
    "priority":"Medium",
    "contacts":"Olaf Mustermann",
    "id":2},

    {"category":"User Story",
    "title":"Titel",
    "description":"description",
    "dueDate":"1.1.1974",
    "priority":"Medium",
    "contacts":"Günter Mustermann",
    "id":3}
];


function init() {
    renderTaskList("toDo", 0);
    renderTaskList("inProgress", 1);
    renderTaskList("awaitFeedback", 2);
    renderTaskList("done", 3);
    includeHTML();
}


function renderTaskList(containerId, taskId) {
    let container = document.getElementById(containerId);
    container.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        currentTask = task["id"];
        
        if (currentTask === taskId) {
            const taskHtml = createTaskHtml(task);
            container.innerHTML += taskHtml;
        }
    }
}


function createTaskHtml(task) {
    let categoryValue = task['category'].split(" ");
    let firstWord =categoryValue[0];
    let categoryClass = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return `<div class="task">
        <div class="${categoryClass}">${task["category"]}</div>
        <div class="previewTitle">${task["title"]}</div>
        <div class="previewDescription" >${task["description"]}</div>
    </div>`;
}

// Suchfunktion
function searchTasks(query) {
    query = query.toLowerCase(); // Um die Suche nicht case-sensitive zu machen

    var results = [];

    allTasks.forEach(function(task) {
        var titleMatch = task.title.toLowerCase().includes(query);
        var descriptionMatch = task.description.toLowerCase().includes(query);

        if (titleMatch || descriptionMatch) {
            results.push(task);
        }
    });

    return results;
}

// Beispiel-Suchanfrage
var searchTerm = 'Task 1'; // Hier das gesuchte Wort oder die Phrase einsetzen
var searchResults = searchTasks(searchTerm);

// Ergebnisse ausgeben
console.log('Suchergebnisse:');
searchResults.forEach(function(result) {
    console.log('ID:', result.id, 'Title:', result.title, 'Description:', result.description);
});