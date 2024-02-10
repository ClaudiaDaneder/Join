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

let subtasks = [];

let title = document.getElementById('title');
let description = document.getElementById('description');
let assignee = document.getElementById('assignee');
let dueDate = document.getElementById('due-date');
let category = document.getElementById('category');
let subtaskField = document.getElementById('subtasks');
let subtaskList = document.getElementById('subtask-list')

let selectedPriority = null;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.addEventListener('click', function () {
            selectPriority(button.dataset.priority);
        });
    });
});

function addNewTask() {
    document.querySelector('.create-button').disabled = true;

    let task = {
        'title': title.value,
        'description': description.value,
        'assignee': assignee.value,
        'due-date': dueDate.value,
        'prio': selectedPriority,
        'category': category.value,
        'subtasks': subtasks
    }

    checkPriority(task);
    storeSubtasks();
    saveToLocalStorage(task);
    clearSubtaskList();
    resetForm();
    redirectToBoard();
}


function saveToLocalStorage(task) {
    allTasks.push(task);
    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
}


function checkPriority(task) {
    if (selectedPriority) {
        task.prio = selectedPriority;
    }
}


function addToSubtaskList() {
    if (subtaskField.value !== '') {
        subtaskList.innerHTML += '<li>' + subtaskField.value + '</li>';
        subtaskField.value = '';
    }
}


function storeSubtasks() {
    let subtaskListElements = subtaskList.childNodes;
    for (let i = 0; i < subtaskListElements?.length; i++) {
        let child = subtaskListElements[i];
        subtasks.push(child.innerHTML);
    }
}


function clearSubtaskList() {
    document.getElementById('subtask-list').innerHTML = '';
}

function loadContactsFromStorage() {
    let allContactsAsString = localStorage.getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
    loadContactsIntoDropdown(allContacts);
}


function loadContactsIntoDropdown(allContacts) {
    for (let i = 0; i < allContacts?.length; i++) {
        let contact = allContacts[i];
        let contactName = contact['name'];
        document.getElementById('assignee').innerHTML += `<option value="${contactName}">${contactName}</option>`;
    }
}


function selectPriority(priority) {
    selectedPriority = priority;
    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.classList.remove('selected');
    });
    document.querySelector(`.button-prio-${priority}`).classList.add('selected');
}


function resetForm() {
    document.getElementById('my-form').reset();
    if (selectedPriority) {
        let selectedButton = document.querySelector(`.button-prio-${selectedPriority}`);
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }
        selectedPriority = null;
    }
}


function redirectToBoard() {
    window.location.href = 'board.html'
}