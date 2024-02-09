let allTasks = [
    {
        "title": "Beispiel 1",
        "description": "Beschreibung Beispiel 1",
        "assignee": "Name 1",
        "due-date": "2024-03-02",
        "category": "User Story",
        "subtasks": "Subtask Beispiel 1"
    },
      {
        "title": "Beispiel 2",
        "description": "Beschreibung Beispiel 2",
        "assignee": "Name 2",
        "due-date": "2024-05-02",
        "category": "User Story",
        "subtasks": "Subtask Beispiel 2"
    },
      {
        "title": "Beispiel 3",
        "description": "Beschreibung Beispiel 3",
        "assignee": "Name 3",
        "due-date": "2024-07-18",
        "category": "Technical Task",
        "subtasks": "Subtask Beispiel 3"
    }
];

let title = document.getElementById('title');
let description = document.getElementById('description');
let assignee = document.getElementById('assignee');
let dueDate = document.getElementById('due-date');
let category = document.getElementById('category');
let subtasks = document.getElementById('subtasks');


function addNewTask() {
    let task = {
        'title': title.value,
        'description': description.value,
        'assignee': assignee.value,
        'due-date': dueDate.value,
        'category': category.value,
        'subtasks': subtasks.value
    }

    allTasks.push(task);
    stringifyJSON();
    document.getElementById('my-form').reset();
}

function stringifyJSON() {
    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
}

function addToSubtaskList() {
    let subtask = subtasks.value;

    document.getElementById('subtask-list').innerHTML += '<li>' + subtask + '</li>';
}
