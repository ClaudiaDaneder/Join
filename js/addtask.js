let allTasks = [];
let subtasks = [];
let selectedContacts = [];

let selectedPriority = 'medium';

let title = document.getElementById('title');
let description = document.getElementById('description');
let assignee = document.getElementById('assignee');
let selectedAssignees = document.getElementById('selected-assignees-list');
let dueDate = document.getElementById('due-date');
let categoryField = document.getElementById('category-dropdown-text');
let subtaskField = document.getElementById('subtasks');
let subtaskList = document.getElementById('subtasklist');
let hiddenCategoryDropdown = document.getElementById('hidden-category-dropdown');
let hiddenContactsInput = document.getElementById('hidden-contacts-input')


async function initAddTask() {
    clearLocalStorage();
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}


async function addNewTask() {
    let taskID = await identifyTaskId();
    let task = {
        'title': title.value,
        'description': description.value,
        'assignee-infos': selectedContacts,
        'due-date': dueDate.value,
        'prio': selectedPriority,
        'category': hiddenCategoryDropdown.value,
        'subtasks': subtasks,
        'task-id': taskID,
        'status': 'toDos'
    };
    disableCreateButton();
    checkPriority(task);
    saveToStorage(task);
    resetForm();
    showPopup();
    redirectToBoard();
}


async function loadContactsFromStorage() {
    let allContactsAsString = await getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
    loadContactsIntoDropdown(allContacts);
}


async function saveToStorage(task) {
    let existingTasksString = await getItem('allTasks');
    let existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    existingTasks.push(task);

    let updatedTasksAsString = JSON.stringify(existingTasks);
    await setItem('allTasks', updatedTasksAsString);
}


async function identifyTaskId() {
    let allSavedTasks = JSON.parse(await getItem('allTasks'));
    lastID = allSavedTasks.length;
    return lastID;
}


function loadContactsIntoDropdown(filteredContacts) {
    assignee.innerHTML = '';
    if (filteredContacts?.length < 1) {
        assignee.innerHTML = noContactsToShow();
    } else {
        filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
        filteredContacts.forEach((contact, i) => {
            let contactName = contact['name'];
            let contactColor = contact['color'];
            let initials = initialsLoad(contactName);
            assignee.innerHTML += renderContacts(contactName, contactColor, initials, i);
        });
    }
}

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contacts-dropdown');
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        saveSelectedContacts();
        if (hiddenContactsInput) {
            hiddenContactsInput.classList.add('hide');
            hiddenContactsInput.value = '';
        }
    }
    if (dropdown.classList.contains('active')) {
        document.getElementById('assign-arrow').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assign-arrow').style.transform = 'rotate(0deg)';
    }
    updateSelectedContacts();
});


async function toggleContactsDropdown(event) {
    let dropdown = document.getElementById('contacts-dropdown');
    let dropdownContent = dropdown.querySelector('.dropdown-content');

    if (!dropdownContent.contains(event.target)) {
        await loadContactsFromStorage();
        dropdown.classList.toggle('active');
        enableContactsSearchField();
        loadSelectedContacts();
    }
    if (dropdown.classList.contains('active')) {
        document.getElementById('assign-arrow').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assign-arrow').style.transform = 'rotate(0deg)';
    }
}


function noContactsToShow() {
    return `<label class="checkbox-option no-contacts">No contacts to display. Please add a contact first.</label>`;
}


function renderContacts(contactName, contactColor, initials, i) {
    return `<label class="checkbox-option" id="checkbox-option_${i}" onclick="changeSelectedContactBackground(${i})">
    <img id="checkbox_${i}" src="./img/addtask_contacts_checkbox_empty.svg">
    <div class="name-plus-circle"><div class="assignee-circle ${contactColor}">${initials}</div>${contactName}</div></label>`;
}


function enableContactsSearchField() {
    hiddenContactsInput.classList.remove('hide');
    moveCursorToEnd(hiddenContactsInput);
}


async function filterContacts() {
    let search = hiddenContactsInput.value.toLowerCase();
    let filteredContacts = allContacts.filter(contact => contact['name'].toLowerCase().includes(search));
    selectedContacts.forEach(selectedContact => {
        let index = filteredContacts.findIndex(contact => contact.name === selectedContact.name && contact.color === selectedContact.color);
        if (index === -1) {
            filteredContacts.push(selectedContact);
        }
    });
    loadContactsIntoDropdown(filteredContacts);
}


function updateSelectedContacts() {
    selectedContacts = [];

    let checkboxOptions = document.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(function (checkbox) {
        if (checkbox.classList.contains('checkbox-option-selected')) {
            let contactName = checkbox.querySelector('.name-plus-circle').childNodes[1].textContent.trim();
            let contactColor = checkbox.querySelector('.assignee-circle').classList[1];
            selectedContacts.push({ 'name': contactName, 'color': contactColor });
        }
    });
    generateSelectedAssigneesList();
}


function changeSelectedContactBackground(i) {
    let checkboxOption = document.getElementById(`checkbox-option_${i}`);
    checkboxOption.classList.toggle('checkbox-option-selected');

    let checkboxImage = document.getElementById(`checkbox_${i}`);

    if (checkboxOption.classList.contains('checkbox-option-selected')) {
        checkboxImage.src = './img/addtask_contacts_checkbox_checked.svg';
    } else {
        checkboxImage.src = './img/addtask_contacts_checkbox_empty.svg';
    }
}


function generateSelectedAssigneesList() {
    if (selectedAssignees) {
        selectedAssignees.innerHTML = '';
        for (let c = 0; c < selectedContacts.length; c++) {
            let selectedContact = selectedContacts[c];
            let contactName = selectedContact.name;
            let contactColor = selectedContact.color;
            let initials = initialsLoad(contactName);
            selectedAssignees.innerHTML += `<div class="assignee-circle ${contactColor}" title="${contactName}">${initials}</div>`;
        }
    }
}


function saveSelectedContacts() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
}


function loadSelectedContacts() {
    let savedContacts = localStorage.getItem('selectedContacts');
    if (savedContacts) {
        savedContacts = JSON.parse(savedContacts);
        savedContacts.forEach(contact => {
            let index = allContacts.findIndex(c => c.name === contact.name && c.color === contact.color);
            if (index !== -1) {
                let checkboxOption = document.getElementById(`checkbox-option_${index}`);
                checkboxOption && checkboxOption.classList.add('checkbox-option-selected');
                let checkboxImage = document.getElementById(`checkbox_${index}`);
                checkboxImage && (checkboxImage.src = './img/addtask_contacts_checkbox_checked.svg');
            }
        });
    }
}


function checkPriority(task) {
    task.prio = selectedPriority;
}


document.addEventListener('DOMContentLoaded', function () {
    selectPriority('medium');

    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.addEventListener('click', function () {
            selectPriority(button.dataset.priority);
        });
    });
});


function selectPriority(priority) {
    selectedPriority = priority;
    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.classList.remove('selected');
    });
    let prioButton = document.querySelector(`.button-prio-${priority}`);
    if (prioButton) {
        prioButton.classList.add('selected');
    }
}


document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('category-dropdown');
    let dropdownContent = document.getElementById('category');
    if (!dropdownContent) {
        return;
    }
    if (dropdownContent.contains(event.target)) {
        toggleCategoryDropdown();
        document.getElementById('category-arrow').style.transform = 'rotate(180deg)';
    } else if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        document.getElementById('category-arrow').style.transform = 'rotate(0deg)';
    }
});


function toggleCategoryDropdown() {
    let dropdown = document.getElementById('category-dropdown');
    let isActive = dropdown.classList.contains('active');
    if (isActive) {
        dropdown.classList.remove('active');
        document.getElementById('category-arrow').style.transform = 'rotate(0deg)';
    } else {
        dropdown.classList.add('active');
        document.getElementById('category-arrow').style.transform = 'rotate(180deg)'
    }
}


function selectCategory(category) {
    categoryField.innerHTML = category;
    toggleCategoryDropdown();
    hiddenCategoryDropdown.value = category;
}


function resetForm() {
    document.getElementById('my-form').reset();
    document.querySelector('.create-button').disabled = false;
    categoryField.innerHTML = 'Select task category';
    resetPrioButtons();
    resetCheckboxOptions();
    clearSubtaskField();
    clearSubtaskList();
    clearLocalStorage();
}


function resetPrioButtons() {
    selectPriority('medium');
}


function resetCheckboxOptions() {
    let checkboxOptions = document.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(function (checkbox) {
        checkbox.classList.remove('checkbox-option-selected');
        let checkboxImage = checkbox.querySelector('img');
        if (checkboxImage) {
            checkboxImage.src = './img/addtask_contacts_checkbox_empty.svg';
        }
    });
    updateSelectedContacts();
}


function disableCreateButton() {
    document.querySelector('.create-button').disabled = true;
    document.getElementById('create-button').classList.add('blue-create-button');
}

function clearLocalStorage() {
    localStorage.removeItem('selectedContacts');
}


function showPopup() {
    let w = parseInt(window.innerWidth)
    if (w < 850) {
        document.getElementById('popup-bg-mobile').classList.remove('hide')
    } else {
        document.getElementById('popup-bg').classList.remove('hide')
    }
}


function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2200);
}


function moveCursorToEnd(input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}