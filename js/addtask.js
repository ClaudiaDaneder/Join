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
let hiddenCategoryDropdown = document.getElementById('hidden-dropdown')

/**
 * This function defines all elements of a task that will later be stored in an array. 
 */
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
    }
    disableCreateButton();
    checkPriority(task);
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


function subtaskfieldFocus() {
    document.getElementById('styled-subtaskfield').classList.toggle('subtaskfield-focus')
}

function subtaskfieldBlur() {
    document.getElementById('styled-subtaskfield').classList.remove('subtaskfield-focus')
}

function updateSubtaskButtons() {
    if (subtaskField.value === '') {
        document.getElementById('subtaskfield-buttons').innerHTML = `<button type="button" class="subtaskfield-button-general"><img src="/img/addtask_icon_subtaskfield_plus.svg"></button>`;

    } else {
        document.getElementById('subtaskfield-buttons').innerHTML = `
        <button type="button" class="subtaskfield-button-general" onclick="clearSubtaskField()"><img src="/img/addtask_icon_subtaskfield_cancel.svg"></button>
        <hr>
        <button type="button" class="subtaskfield-button-general" onclick="addToSubtasks()"><img src="/img/addtask_icon_subtaskfield_check.svg"></button>
        </div>`;
    }
}


/**
 * This function is used to generate a list of subtasks, if any were entered in the subtaskField. 
 */
function addToSubtasks() {
    let subtaskContent = subtaskField.value.trim();
    if (!subtaskContent) {
        return;
    }
    subtasks.push({ 'subtasktext': subtaskContent, 'done': false });
    clearSubtaskField();
    generateSubtasklist();
}


function generateSubtasklist() {
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i].subtasktext;
        subtaskList.innerHTML +=
            `<div class="subtasklist-item" id="subtasklist-item_${i}" ondblclick="editSubtasklistItem(${i})" onmouseenter="showEditButtons(${i})" onmouseleave="showEditButtons(${i})">
                <div class="subtasklist-infos">
                    <div class="subtasklist-marker">•</div>${subtask}
                </div>
                <div id="edit-buttons_${i}" class="subtaskfield-button-container hide">
                    <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
                    <hr>
                    <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                </div>`;
    }
}

function showEditButtons(i) {
    let editButtons = document.getElementById(`edit-buttons_${i}`);
    if (editButtons) {
        editButtons.classList.toggle('hide');
    }
}

function editSubtasklistItem(s) {
    let listItem = document.getElementById(`subtasklist-item_${s}`);

    if (subtasks[s]) {
        let subtaskText = subtasks[s].subtasktext;

        // Erstelle das neue HTML-Element für das bearbeitete Listenelement
        let newHTML = `
        <div class="styled-subtaskitem-edit-input">
            <input class="subtaskitem-edit-input" type="text" id="editfield" value="${subtaskText}">
            <div class="subtaskfield-button-container">
                <button type="button" class="subtaskfield-button-general" onclick="deleteSubtasklistItem(${s})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
                <button type="button" class="subtaskfield-button-general" onclick="updateSubtasklistItem(${s})"><img src="/img/addtask_icon_subtaskfield_check.svg"></button>
            </div>
        </div>`;
        listItem.innerHTML = newHTML;
        let editField = document.getElementById('editfield');
        if (editField) {
            moveCursorToEnd(editField);
        }
    }
}

function moveCursorToEnd(input) {
    input.focus(); // Fokussiere das Inputfeld
    input.setSelectionRange(input.value.length, input.value.length);
}


function deleteSubtasklistItem(s) {
    subtasks.splice(s, 1);
    generateSubtasklist();
}

function updateSubtasklistItem(s) {
    let editField = document.getElementById('editfield');

    subtasks[s].subtasktext = editField.value;
    setTimeout(() => {
        generateSubtasklist();
    }, 100); // Füge eine kurze Verzögerung hinzu (z.B. 100ms)
}

function clearSubtaskField() {
    subtaskField.value = '';
    updateSubtaskButtons()
}

/**
 * This function is used to clear the list of subtasks again, either when the 'clear' button has been pressed, or a new task has been created.
 */
function clearSubtaskList() {
    subtaskList.innerHTML = '';
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
    return `<label class="checkbox-option" id="checkbox-option_${i}" onclick="changeSelectedContactBackground(${i})">
    <img id="checkbox_${i}" src="./img/addtask_contacts_checkbox_empty.svg">
    <div class="name-plus-circle"><div class="assignee-circle ${contactColor}">${initials}</div>${contactName}</div></label>`;
}

/**
 * This function is used to record all checked checkboxes within the contacts-dropdown and push the values (names and assigned colors) into the array 'selectedContacts'.
 */
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


/**
 * This function is used to change the background color and font color of selected contacts in the contact-dropdown. With colors, it also changes the image of the checkbox from empty to checked.
 * 
 * @param {number} i 
 */
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


/**
 * This function is used to generate colored circles with the initials of the contacts that have been picked from the contacts-dropdown (i.e. have been pushed into the array 'selectedContacts').
 */
function generateSelectedAssigneesList() {
    selectedAssignees.innerHTML = '';
    for (let c = 0; c < selectedContacts.length; c++) {
        let selectedContact = selectedContacts[c];
        let contactName = selectedContact.name;
        let contactColor = selectedContact.color;
        let initials = initialsLoad(contactName);
        selectedAssignees.innerHTML += `<div class="assignee-circle ${contactColor}" title="${contactName}">${initials}</div>`;
    }
}

/**
 * This function is used to check if one of the 3 priority buttons has been activated. If so, the chosen priority is set as 'prio' for the current task.
 * 
 * @param {string} task 
 */
function checkPriority(task) {
    task.prio = selectedPriority;
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
    }

    if (dropdown.classList.contains('active')) {
        document.getElementById('assign-arrow').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assign-arrow').style.transform = 'rotate(0deg)';
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

    if (dropdown.classList.contains('active')) {
        document.getElementById('assign-arrow').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assign-arrow').style.transform = 'rotate(0deg)';
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
        document.getElementById('category-arrow').style.transform = 'rotate(180deg)';
    } else if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        document.getElementById('category-arrow').style.transform = 'rotate(0deg)';
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
        document.getElementById('category-arrow').style.transform = 'rotate(0deg)';
    } else {
        dropdown.classList.add('active');
        document.getElementById('category-arrow').style.transform = 'rotate(180deg)'
    }
}

/**
 * This function is used to update the value of the category-dropdown, put the value also into the hidden input field (needed for form validation) and close the dropdown once a category has been chosen.
 * 
 * @param {string} category Category of the task, either 'User Story' or 'Technical Task'
 */
function selectCategory(category) {
    categoryField.innerHTML = category;
    toggleCategoryDropdown();
    hiddenCategoryDropdown.value = category;
}

/**
 * This function resets the form and all inputs, buttons, lists etc. to their initial state, either when the 'clear' button is pressed or a new task has been created. 
 */
function resetForm() {
    document.getElementById('my-form').reset();
    document.querySelector('.create-button').disabled = false;
    categoryField.innerHTML = 'Select task category';
    resetPrioButtons();
    resetCheckboxOptions();
    clearSubtaskField();
    clearSubtaskList();
}

/**
 * This function resets the priority buttons to their initial state (=none is selected). This function is being triggered by the function {@link resetForm()}
 */
function resetPrioButtons() {
    selectPriority('medium');
}

/**
 * This function is used to reset all checkboxes within the contacts-dropdown after either the 'clear' button has been pressed or a new task has been created.
 */
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
 * This function redirects to the board-overview after a short delay of 180ms.
 */
function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 1800);
}