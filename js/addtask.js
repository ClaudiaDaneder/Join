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
let subtaskList = document.getElementById('subtask-list');
let hiddenCategoryDropdown = document.getElementById('hidden-dropdown')

/**
 * This function defines all elements of a task that will later be stored in an array. 
 */
async function addNewTask() {
    let taskID = await identifyTaskId();
    let task = {
        'title': title.value,
        'description': description.value,
        'assignee': selectedContacts,
        'due-date': dueDate.value,
        'prio': selectedPriority,
        'category': hiddenCategoryDropdown.value,
        'subtasks': subtasks,
        'task-id': taskID
    }
    disableCreateButton();
    checkPriority(task);
    storeSubtasks();
    saveToStorage(task);
    resetForm();
    showPopup();
    redirectToBoard();
}

/**
 * This function pulls the existing tasks from the remote storage, updates it with the current task, and saves everything to the remote storage under the key 'allTasks'. 
 * 
 * @param {string} task 
 */
async function saveToStorage(task) {
    let existingTasksString = await getItem('allTasks');
    let existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    existingTasks.push(task);

    let updatedTasksAsString = JSON.stringify(existingTasks);
    await setItem('allTasks', updatedTasksAsString);
}

/**
 * This function identifies which task-id should be assigned to the current task. Tasks are assigned consecutive numbers, starting at 0.
 * 
 * @returns {number} The task-id assigned to our current task
 */
async function identifyTaskId() {
    let allSavedTasks = JSON.parse(await getItem('allTasks'));
    let lastID = -1;
    if (Array.isArray(allSavedTasks)) {
        lastID = allSavedTasks.length;
    }
    return lastID + 1;
}

/**
 * This function is used to generate a list of subtasks, if any were entered in the subtaskField. 
 */
function addToSubtaskList() {
    if (subtaskField.value !== '') {
        subtaskList.innerHTML += '<li>' + subtaskField.value + '</li>';
        subtaskField.value = '';
    }
}

/**
 * This function is used to store the list of subtasks into an array 'subtasks'.
 */
function storeSubtasks() {
    let subtaskListElements = subtaskList.childNodes;
    for (let i = 0; i < subtaskListElements?.length; i++) {
        let child = subtaskListElements[i];
        subtasks.push(child.innerHTML);
    }
}

/**
 * This function is used to clear the list of subtasks again, either when the 'clear' button has been pressed, or a new task has been created.
 */
function clearSubtaskList() {
    document.getElementById('subtask-list').innerHTML = '';
}

/**
 * This function is used to get all available contacts from the remote storage under the key 'allContacts'.
 */
async function loadContactsFromStorage() {
    let allContactsAsString = await getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
    loadContactsIntoDropdown(allContacts);
}

/**
 * This function checks if contacts are available to load into the Contacts-Dropdown. If no contacts are available, a message is shown. If there are contacts to be displayed, they will be shown in the contacts-dropdown. 
 * 
 * @param {Array} allContacts All available contacts, as previously fetched from the remote storage
 */
function loadContactsIntoDropdown(allContacts) {
    if (allContacts?.length < 1) {
        assignee.innerHTML = noContactsToShow();
    } else {
        for (let i = 0; i < allContacts?.length; i++) {
            let contact = allContacts[i];
            let contactName = contact['name'];
            let contactColor = contact['color'];
            let initials = initialsLoad(contactName);
            assignee.innerHTML += renderContacts(contactName, contactColor, initials, i);
        }
    }
}

/**
 * This function generates a message, in case no contacts are availbale to chose from in the contacts- dropdown.
 * 
 * @returns {string}
 */
function noContactsToShow() {
    return `<label class="checkbox-option no-contacts">No contacts to display. Please add a contact first.<button onclick="addContact(); return false">Add Contact</button></label>`;
}

/**
 * This function returns a list of available contacts to assign the task to. For each contact, their name, initials in a colored circle, and a checkbox is generated. 
 * 
 * @param {string} contactName Name of the contact
 * @param {string} contactColor Color that has been assigned to the contact randomly upon creation 
 * @param {string} initials Initials of the contact
 * @returns {string}
 */
function renderContacts(contactName, contactColor, initials, i) {
    return `<label class="checkbox-option" id="checkbox-option_${i}" onclick="changeContactColor(${i})">
    <img id="checkbox_${i}" src="./img/addtask_contacts_checkbox_empty.svg">
    <div class="name-plus-circle"><div class="assignee-circle ${contactColor}">${initials}</div>${contactName}</div></label>`;
}

/**
 * This function is used to record all checked checkboxes within the contacts-dropdown and push the values into the array 'selectedContacts'.
 */
function updateSelectedContacts() {
    selectedContacts = [];

    let checkboxOptions = document.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(function (checkbox) {
        if (checkbox.classList.contains('checkbox-option-selected')) {
            let contactName = checkbox.querySelector('.name-plus-circle').childNodes[1].textContent.trim();
            selectedContacts.push(contactName);
        }
    });
    generateSelectedAssigneesList();
    console.log(selectedContacts)
}

/**
 * This function is used to generate colored circles with the initials of the contacts that have been picked from the contacts-dropdown (i.e. have been pushed into the array 'selectedContacts').
 */
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

/**
 * This function is used to check if one of the 3 priority buttons has been activated. If so, the chosen priority is set as 'prio' for the current task.
 * 
 * @param {string} task 
 */
function checkPriority(task) {
    if (selectedPriority) {
        task.prio = selectedPriority;
    }
}

/**
 * This function is used to check if one of the three priority buttons has been clicked. If so, it triggers the {@link selectedPriority}-function with the chosen value of priority (urgent, medium or low). If no button is clicked, the standard prio is set to 'medium'.
 */
document.addEventListener('DOMContentLoaded', function () {
    selectPriority('medium');

    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.addEventListener('click', function () {
            selectPriority(button.dataset.priority);
        });
    });
});

/**
 * This function updates the global variable 'selectedPriority' to the priority of the chosen button and marks it as selected. Once the user clicks on a different priority button, the selection is removed and added to the current button.
 * 
 * @param {string} priority The chosen priority as string ('urgent', 'medium' or 'low')
 */
function selectPriority(priority) {
    selectedPriority = priority;
    document.querySelectorAll('.prio-button-container button').forEach(button => {
        button.classList.remove('selected');
    });
    document.querySelector(`.button-prio-${priority}`).classList.add('selected');
}

/**
 * This function is used to record a click event outside of the contacts-dropdown, which then closes it and updates the list of selected contacts.
 */
document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contacts-dropdown');

    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        updateSelectedContacts();
    }
    updateSelectedContacts();
});

/**
 * This function is used to either open or close the contacts-dropdown, depending on whether the click event happened inside or outside of the dropdown-content.
 * 
 * @param {Event} event Event that triggers the function (= click)
 */
function toggleContactsDropdown(event) {
    let dropdown = document.getElementById('contacts-dropdown');
    let dropdownContent = dropdown.querySelector('.dropdown-content');

    if (!dropdownContent.contains(event.target)) {
        dropdown.classList.toggle('active');
    }
}

/**
 * This function is used to record a click event and to toggle the visibility of the category-dropdown.
 * Closes the dropdown menu if the click event occurs outside the dropdown menu or its contents.
 */
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

/**
 * This function either opens or closes the category-dropdown.
 */
function toggleCategoryDropdown() {
    let dropdown = document.getElementById('category-dropdown');
    let isActive = dropdown.classList.contains('active');
    if (isActive) {
        dropdown.classList.remove('active');
    } else {
        dropdown.classList.add('active');
    }
}

/**
 * This function is used to update the value of the category-dropdown and close the dropdown once a category has been chosen.
 * 
 * @param {string} category Category of the task, either 'User Story' or 'Technical Task'
 */
function selectCategory(category) {
    categoryField.innerHTML = category;
    toggleCategoryDropdown();
    document.getElementById('hidden-dropdown').value = category;
}

/**
 * This function resets the form and all inputs, buttons, lists etc. to their initial state, either when the 'clear' button is pressed or a new task has been created. 
 */
function resetForm() {
    document.getElementById('my-form').reset();
    document.querySelector('.create-button').disabled = false;
    document.getElementById('category-dropdown-text').innerHTML = 'Select task category';
    resetPrioButtons();
    resetCheckboxOptions();
    clearSubtaskList();
}

/**
 * This function resets the priority buttons to their initial state (=none is selected). This function is being triggered by the function {@link resetForm()}
 */
function resetPrioButtons() {
    if (selectedPriority) {
        let selectedButton = document.querySelector(`.button-prio-${selectedPriority}`);
        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }
        selectedPriority = null;
    }
}

/**
 * This function is used to reset all checkboxes within the contacts-dropdown after either the 'clear' button has been pressed or a new task has been created.
 */
function resetCheckboxOptions() {
    let checkboxOptions = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
    checkboxOptions.forEach(function (checkbox) {
        checkbox.checked = false;
    });
    updateSelectedContacts();
}

/**
 * This function is used to disable and change the color of the Create-button while the current task is being saved. 
 */
function disableCreateButton() {
    document.querySelector('.create-button').disabled = true;
    document.getElementById('create-button').classList.add('blue-create-button');
}

/**
 * This function is used to show the popup that tells the user that the new task has been created and added to the board of tasks.
 */
function showPopup() {
    document.getElementById('popup-bg').classList.remove('hide')
}

/**
 * This function redirects to the board-overview after a short delay of 220ms.
 */
function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2200);
}


function changeContactColor(i) {
    let checkboxOption = document.getElementById(`checkbox-option_${i}`);
    checkboxOption.classList.toggle('checkbox-option-selected');
    
    let checkboxImage = document.getElementById(`checkbox_${i}`);
    let contactName = checkboxOption.querySelector('.name-plus-circle').childNodes[1].textContent.trim();
    
    if (checkboxOption.classList.contains('checkbox-option-selected')) {
        checkboxImage.src = './img/addtask_contacts_checkbox_checked.svg';
        selectedContacts.push(contactName);
    } else {
        checkboxImage.src = './img/addtask_contacts_checkbox_empty.svg';
        selectedContacts = selectedContacts.filter(name => name !== contactName);
    }
    generateSelectedAssigneesList();
}


/*function changeContactColor(i) {

    let checkboxOption = document.getElementById(`checkbox-option_${i}`);
    checkboxOption.classList.toggle('checkbox-option-selected');

    let checkboxImage = document.getElementById(`checkbox_${i}`);
    let contactName = checkboxOption.querySelector('.name-plus-circle').childNodes[1].textContent.trim();
    
    if (selectedContacts.includes(contactName)) {
        checkboxImage.src = './img/addtask_contacts_checkbox_checked.svg';
    } else {
        checkboxImage.src = './img/addtask_contacts_checkbox_empty.svg';
    }

    document.getElementById(`checkbox_${i}`).src = './img/addtask_contacts_checkbox_checked.svg'
}

*/