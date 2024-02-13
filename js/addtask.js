let allTasks = [];
let subtasks = [];
let selectedContacts = [];
let selectedPriority = null;
let title = document.getElementById('title');
let description = document.getElementById('description');
let assignee = document.getElementById('assignee');
let selectedAssignees = document.getElementById('selected-assignees-list');
let dueDate = document.getElementById('due-date');
let category = document.getElementById('category-dropdown-text');
let subtaskField = document.getElementById('subtasks');
let subtaskList = document.getElementById('subtask-list');

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.addEventListener('click', function () {
            selectPriority(button.dataset.priority);
        });
    });
});

function addNewTask() {
    let taskID = identifyID();
    let task = {
        'title': title.value,
        'description': description.value,
        'assignee': selectedContacts,
        'due-date': dueDate.value,
        'prio': selectedPriority,
        'category': category.value,
        'subtasks': subtasks,
        'task-id': taskID
    }
    disableCreateButton();
    changeCreateButtonColor();
    checkPriority(task);
    storeSubtasks();
    saveToStorage(task);
    resetForm();
    showPopup();
    redirectToBoard();
}

async function saveToStorage(task) {
    // Holen Sie das vorhandene allTasks-Array aus dem Speicher
    let existingTasksString = await getItem('allTasks');
    let existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    // Fügen Sie den neuen Task zum vorhandenen Array hinzu
    existingTasks.push(task);

    // Konvertieren Sie das aktualisierte Array in einen JSON-String und speichern Sie es
    let updatedTasksAsString = JSON.stringify(existingTasks);
    await setItem('allTasks', updatedTasksAsString);
}


function identifyID() {
    lastID = allTasks.length;
    if (lastID == null || lastID == '') {
        lastID = 0;
    }
    return lastID + 1;
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


async function loadContactsFromStorage() {
    let allContactsAsString = await getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
    loadContactsIntoDropdown(allContacts);
}


function loadContactsIntoDropdown(allContacts) {
    if (allContacts?.length < 1) {
        assignee.innerHTML += `<label class="checkbox-option no-contacts">No contacts to display. Please add a contact first.<button onclick="addContact(); return false">Add Contact</button></label>`;
    } else {
        for (let i = 0; i < allContacts?.length; i++) {
            let contact = allContacts[i];
            let contactName = contact['name'];
            let contactColor = contact['color'];
            let initials = initialsLoad(contactName);
            assignee.innerHTML += `
        <label class="checkbox-option">
        <input type="checkbox" value="${contactName}">
        <div class="name-plus-circle"><div class="assignee-circle ${contactColor}">${initials}</div>${contactName}</div></label>`;
        }
    }
}

function generateSelectedAssigneesList() {
    selectedAssignees.innerHTML = '';
    for (let c = 0; c < selectedContacts.length; c++) {
        let selectedContact = allContacts.find(contact => contact.name === selectedContacts[c]);
        if (selectedContact) {
            let contactColor = selectedContact.color;
            let initials = initialsLoad(selectedContact.name);
            selectedAssignees.innerHTML += `<div class="assignee-circle ${contactColor}" title="${selectedContact.name}">${initials}</div>`;
        }
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
    document.querySelector('.create-button').disabled = false;
    resetPrioButtons();
    resetCheckboxOptions();
    clearSubtaskList();
    document.getElementById('category-dropdown-text').innerHTML = 'Select task category';
}


function showPopup() {
    document.getElementById('popup-bg').classList.remove('hide')
}


function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2200);
}


function resetPrioButtons() {
    if (selectedPriority) {
        let selectedButton = document.querySelector(`.button-prio-${selectedPriority}`);
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }
        selectedPriority = null;
    }
}


function disableCreateButton() {
    document.querySelector('.create-button').disabled = true;
}


function changeCreateButtonColor() {
    document.getElementById('create-button').classList.add('active-create-button');
}


function toggleCategoryDropdown() {
    let dropdown = document.getElementById('category-dropdown');
    let isActive = dropdown.classList.contains('active');
    if (isActive) {
        dropdown.classList.remove('active');
    } else {
        dropdown.classList.add('active');
    }
}

function selectCategory(category) {
    let dropdowntext = document.getElementById('category-dropdown-text');
    dropdowntext.innerHTML = category;
    toggleCategoryDropdown();
}

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('category-dropdown');
    let dropdownContent = document.getElementById('category');

    if (!dropdownContent) {
        return;
    }

    if (dropdownContent.contains(event.target)) {
        toggleCategoryDropdown();
    } else if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});


function toggleContactsDropdown(event) {
    let dropdown = document.getElementById('contacts-dropdown');
    let dropdownContent = dropdown.querySelector('.dropdown-content');

    if (!dropdownContent.contains(event.target)) {
        dropdown.classList.toggle('active');
        updateSelectedContacts();
    }
}

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contacts-dropdown');

    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        updateSelectedContacts();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    let checkboxOptions = document.querySelectorAll('.checkbox-option input[type="checkbox"]');

    checkboxOptions.forEach(function (option) {
        option.addEventListener('change', function (event) {
            updateSelectedContacts();
        });
    });
});


function updateSelectedContacts() {
    selectedContacts = [];

    let checkboxOptions = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
    checkboxOptions.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedContacts.push(checkbox.value);
        }
    });
    generateSelectedAssigneesList();
}


function resetCheckboxOptions() {
    let checkboxOptions = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
    checkboxOptions.forEach(function (checkbox) {
        checkbox.checked = false;
    });
    updateSelectedContacts();
}