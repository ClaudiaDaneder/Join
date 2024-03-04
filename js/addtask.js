let allTasks = [];
let subtasks = [];
let selectedContacts = [];
let selectedPriority;


async function initAddTask() {
    clearLocalStorage();
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}


/**
 * This function defines what constitutes a task, and collects all necessary data to store it. 
 */
async function addNewTask() {
    let taskID = await determineTaskId();
    let state = document.getElementById('my-form').value;
    if (state === undefined) {
        state = 'toDos';
    }
    let task = {
        'title': document.getElementById('title').value,
        'description': document.getElementById('description').value,
        'assignee-infos': selectedContacts,
        'due-date': document.getElementById('due-date').value,
        'prio': selectedPriority,
        'category': document.getElementById('hidden-category-dropdown').value,
        'subtasks': subtasks,
        'task-id': taskID,
        'status': state
    };
    disableCreateButton();
    checkPriority(task);
    saveToStorage(task);
    resetForm();
    showPopup();
    redirectToBoard();
}


/**
 * This function loads all previously saved contacts from storage.
 */
async function loadContactsFromStorage() {
    let allContactsAsString = await getItem('allContacts');
    allContacts = JSON.parse(allContactsAsString);
    loadContactsIntoDropdown(allContacts);
}


/**
 * This function first loads the previously saved tasks from storage, then pushes the current task into this array, and then saves all of them to the storage again. 
 * 
 * @param {Array} task 
 */
async function saveToStorage(task) {
    let existingTasksString = await getItem('allTasks');
    let existingTasks = existingTasksString ? JSON.parse(existingTasksString) : [];

    existingTasks.push(task);

    let updatedTasksAsString = JSON.stringify(existingTasks);
    await setItem('allTasks', updatedTasksAsString);
}


/**
 * This function is used to determine the task-id of the current task, by checking the last task-id in storage, and adding 1 to it, so that they have consecutive, unique IDs.
 * 
 * @returns 'task-id' of the current task
 */
async function determineTaskId() {
    let allSavedTasks = JSON.parse(await getItem('allTasks'));
    lastID = allSavedTasks[allSavedTasks.length - 1];
    if (lastID == null || lastID == '') {
        lastID = 0;
    } else {
        lastID = lastID['task-id'] + 1;
    }
    return lastID;
}


/**
 * This function is used to load matching contacts into the contacts dropdown. If no contacts are available, a message will be displayed.
 * 
 * @param {Array} filteredContacts 
 */
function loadContactsIntoDropdown(filteredContacts) {
    let assignee = document.getElementById('assignee');
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


/**
 * This function registers clicks outside of the contacts dropdown area. If the dropdown is open, the function closes it and hides the input field. 
 */
document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contacts-dropdown');
    let hiddenContactsInput = document.getElementById('hidden-contacts-input');
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        hiddenContactsInput.classList.add('hide');
        hiddenContactsInput.value = '';
        saveSelectedContacts();
    }
    if (dropdown.classList.contains('active')) {
        document.getElementById('assign-arrow').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assign-arrow').style.transform = 'rotate(0deg)';
    }
    updateSelectedContacts();
});


/**
 * This function is used to open or close the contacts dropdown on click.
 * 
 * @param {Event} event
 */
async function toggleContactsDropdown(event) {
    let dropdown = document.getElementById('contacts-dropdown');
    let dropdownContent = document.getElementById('assignee');

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


/**
 * This function returns the appropriate html-code in case there are no contacts to display in the contacts dropdown.
 * 
 * @returns string
 */
function noContactsToShow() {
    return `<label class="checkbox-option no-contacts">No contacts to display. Please add a contact first.</label>`;
}


/**
 * This function renders the necessary information for all available contacts into the contacts dropdown.
 * 
 * @param {string} contactName 
 * @param {string} contactColor 
 * @param {string} initials 
 * @param {number} i 
 * @returns 
 */
function renderContacts(contactName, contactColor, initials, i) {
    return `<label class="checkbox-option" id="checkbox-option_${i}" onclick="changeSelectedContactBackground(${i})">
    <img id="checkbox_${i}" src="./img/addtask_contacts_checkbox_empty.svg">
    <div class="name-plus-circle"><div class="assignee-circle ${contactColor}">${initials}</div>${contactName}</div></label>`;
}


/**
 * This function transforms the header of the contacts dropdown into an input field to filter contacts on input. 
 */
function enableContactsSearchField() {
    let hiddenContactsInput = document.getElementById('hidden-contacts-input');
    hiddenContactsInput.classList.remove('hide');
    moveCursorToEnd(hiddenContactsInput);
}


/**
 * This function filters contacts on input. Until an input is made, all saved contacts will be displayed
 */
async function filterContacts() {
    let hiddenContactsInput = document.getElementById('hidden-contacts-input');
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


/**
 * This function updates the array of selected contacts based on whether their checkbox has been checked or not. The contact name and their associated color are being registered.
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
 * This function changes the background color and the image of the checkbox if a contact has been selected within the contacts dropdown. 
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
 * This function generates a list of selected contacts in the form of colored circles containing the intials of the respective contacts. 
 */
function generateSelectedAssigneesList() {
    let selectedAssignees = document.getElementById('selected-assignees-list');
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
 * This function temporarily stores the array of the selected contacts in the local storage.
 */
function saveSelectedContacts() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
}


/**
 * This function loads the selected contacts from local storage and marks those previously selected ones again, in case the contacts dropdown has been closed and opened up again.
 */
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


/**
 * This function sets the priority-buttons to 'medium' by default. It registers clicks on other priority-buttons and sets the priority accordingly.
 */
document.addEventListener('DOMContentLoaded', function () {
    selectPriority('medium');

    document.addEventListener('click', function (event) {
        if (event.target.closest('.prio-button-container button')) {
            selectPriority(event.target.dataset.priority);
        }
    });
});


/**
 * This function adds or removes the appropriate css class to or from the selected priority button to highlight it correctly.
 * 
 * @param {string} priority 
 */
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


/**
 * This function registers the selected priority button and sets the 'prio' value in task to the selected one. 
 * 
 * @param {Array} task 
 */
function checkPriority(task) {
    task.prio = selectedPriority;
}


/**
 * This function registers clicks on the document. Based on the clicked element, it either opens the user dropdown menu, toggles the category dropdown or closes the dropdown (if the click happens outside of the dropdown area). 
 */
document.addEventListener('click', function (event) {
    if (document.getElementById('logoutScreen').style.display == 'flex') {
        openUser();
    }
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
 * This function opens and closes the category dropdown.
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
 * This function is used to select a value from the category dropdown. As soon as a selection is made, the dropdown is being closed and the selection set as the value of a hidden input field to report it back to "task".
 * 
 * @param {string} category 
 */
function selectCategory(category) {
    let categoryField = document.getElementById('category-dropdown-text');
    let hiddenCategoryDropdown = document.getElementById('hidden-category-dropdown');
    categoryField.innerHTML = category;
    toggleCategoryDropdown();
    hiddenCategoryDropdown.value = category;
    if (hiddenCategoryDropdown.value) {
        document.getElementById('category-arrow').classList.add('hide')
    }
}


/**
 * This function is used to reset all fields back to their default values.
 */
function resetForm() {
    document.getElementById('my-form').reset();
    document.querySelector('.create-button').disabled = false;
    resetCategoryField();
    resetPrioButtons();
    resetCheckboxOptions();
    clearSubtaskField();
    clearSubtaskList();
    clearLocalStorage();
}


/**
 * This function is used to reset the default value of the priority buttons back to 'medium'.
 */
function resetPrioButtons() {
    selectPriority('medium');
}


/**
 * This function is used to reset the category dropdown.
 */
function resetCategoryField() {
    document.getElementById('category-arrow').classList.remove('hide')
    document.getElementById('category-dropdown-text').innerHTML = 'Select task category';
}


/**
 * This function is used to reset the checkboxes and background colors within the contacts dropdown.
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
 * This function disables the 'create task' button while the task is being saved to the board.
 */
function disableCreateButton() {
    document.querySelector('.create-button').disabled = true;
    document.getElementById('create-button').classList.add('blue-create-button');
}


/**
 * This function clears the temporarily stored selected contacts from the local storage.
 */
function clearLocalStorage() {
    localStorage.removeItem('selectedContacts');
}


/**
 * This function shows the popup to indicate that the task has been saved.
 */
function showPopup() {
    let w = parseInt(window.innerWidth)
    if (w < 850) {
        document.getElementById('popup-bg-mobile').classList.remove('hide')
    } else {
        document.getElementById('popup-bg').classList.remove('hide')
    }
}


/**
 * This function redirects the user to the board, after a short timeout.
 */
function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 900);
}


/**
 * This function sets the cursor at the end of an input value to make it easier to edit the value.
 * 
 * @param {Element} input 
 */
function moveCursorToEnd(input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}