let allTasks = [];

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
        'category': category.value
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
