/**
 * This function is used to display different icons on the subtask input based on the value. as sson as an input is made, the buttons to either clear or add a subtask are displayed. 
 */
function updateSubtaskButtons(id) {
    let subtaskField = document.getElementById('subtasks');
    if (subtaskField.value === '') {
        document.getElementById('subtaskfield-buttons').innerHTML = showPlusButton();

    } else {
        document.getElementById('subtaskfield-buttons').innerHTML = showClearOrAddButtons(id);
    }
}


/**
 * This function returns the html code to display the + symbol.
 * 
 * @returns string
 */
function showPlusButton() {
    return `<button type="button" class="subtaskfield-button-general"><img src="/img/addtask_icon_subtaskfield_plus.svg"></button>`;
}


/**
 * This function returns the html code to display the buttons to either clear or add a subtask.
 * 
 * @returns string
 */
function showClearOrAddButtons(id) {
    let button = `addToSubtasks()`;
    if(id){
        button = `setNewSubTask(${id})`;
    }
    return `<button type="button" class="subtaskfield-button-general" onclick="clearSubtaskField()"><img src="/img/addtask_icon_subtaskfield_cancel.svg"></button><hr><button type="button" class="subtaskfield-button-general" onclick="${button}"><img src="/img/addtask_icon_subtaskfield_check.svg"></button></div>`;
}


/**
 * This function is used to save the current subtask into the array "subtasks". 
 */
function addToSubtasks() {
    let subtaskField = document.getElementById('subtasks');
    let subtaskContent = subtaskField.value.trim();
    if (!subtaskContent) {
        return;
    }
    subtasks.push({ 'subtasktext': subtaskContent, 'done': false });
    clearSubtaskField();
    generateSubtasklist();
}


/**
 * This function is used to generate a list of each subtask that is currently stored within the array "subtasks".
 */
function generateSubtasklist() {
    let subtaskList = document.getElementById('subtasklist');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i].subtasktext;
        subtaskList.innerHTML += showSubtaskItem(i, subtask)
    }
}


/**
 * This function generates the html code for each individual subtask, including the buttons to either edit or delete the subtask.
 * 
 * @param {number} i 
 * @param {string} subtask 
 * @returns string
 */
function showSubtaskItem(i, subtask) {
    return `<div class="subtasklist-item" id="subtasklist-item_${i}" ondblclick="editSubtasklistItem(${i})" onmouseenter="showEditButtons(${i})" onmouseleave="showEditButtons(${i})">
    <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subtask}</div>
    <div id="edit-buttons_${i}" class="subtaskfield-button-container hide">
        <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
        <hr>
        <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
    </div>`;
}


/**
 * This function is used to show or hide the buttons used to either edit or delete an item from the subtask list when hovering over the respective item.
 * 
 * @param {number} i 
 */
function showEditButtons(i) {
    let editButtons = document.getElementById(`edit-buttons_${i}`);
    if (editButtons) {
        editButtons.classList.toggle('hide');
    }
}


/**
 * This function is used to transform a subtasklist item into an input field in order to edit the subtasklist item. The cursor is automatically moved to the end of the value.
 * 
 * @param {number} s 
 * @param {number} id 
 * @param {number} j 
 */
function editSubtasklistItem(s, id, j) {
    let listItem = document.getElementById(`subtasklist-item_${s}`);
    
    if (subtasks[s]) {
        let subtaskText = subtasks[s].subtasktext;

        let newHTML = showSubtaskItemEditField(subtaskText, s, id, j);
        listItem.innerHTML = newHTML;
        let editField = document.getElementById('editfield');
        if (editField) {
            moveCursorToEnd(editField);
        }
    }
}


/**
 * This function returns html code that is needed to display the input field. Depending on where the function is being used (at addtask or on the board), the buttons to delete or update a subtasklist item each have different functionalities.
 * 
 * @param {string} subtaskText 
 * @param {number} s 
 * @param {number} id 
 * @returns string
 */
function showSubtaskItemEditField(subtaskText, s, id) {
    let updatebutton = `updateSubtasklistItem(${s})`;
    let deletebutton = `deleteSubtasklistItem(${s})`;
    if(id){
        updatebutton =  `updateEditPopup(${s}, ${id})`;
        deletebutton =  `deleteSubtasklist(${s}, ${id})`;
    }
    return `<div class="styled-subtaskitem-edit-input">
        <input class="subtaskitem-edit-input" type="text" id="editfield" value="${subtaskText}">
        <div class="subtaskfield-button-container">
            <button type="button" class="subtaskfield-button-general" id="deleteButton" onclick="${deletebutton}"><img src="/img/addtask_icon_subtask_delete.svg"></button>
            <button type="button" class="subtaskfield-button-general" id="updateButton" onclick="${updatebutton}"><img src="/img/addtask_icon_subtaskfield_check.svg"></button>
        </div>
    </div>`;
}


/**
 * This function adds a blue border to the subtaskfield when it's in focus.
 */
function subtaskfieldFocus() {
    document.getElementById('styled-subtaskfield').classList.toggle('subtaskfield-focus')
}


/**
 * This function removes the blue border when it's not in focus.
 */
function subtaskfieldBlur() {
    document.getElementById('styled-subtaskfield').classList.remove('subtaskfield-focus')
}


/**
 * This function is used to delete a specific item from the array "subtasks".
 * 
 * @param {number} s 
 */
function deleteSubtasklistItem(s) {
    subtasks.splice(s, 1);
    generateSubtasklist();
}


/**
 * This function updates the new value from the input field to the respective item within the subtasklist, and then regenerates the list of subtasks after a short timeout.
 * 
 * @param {number} s 
 */
function updateSubtasklistItem(s) {
    let editField = document.getElementById('editfield');
    
    subtasks[s].subtasktext = editField.value;
    setTimeout(() => {
        generateSubtasklist();
    }, 100);
}


/**
 * This function is used to reset the input field and respective buttons to the default values after a subtask has been added to the list.
 */
function clearSubtaskField() {
    let subtaskField = document.getElementById('subtasks');
    subtaskField.value = '';
    updateSubtaskButtons()
}


/**
 * This function clears the subtask list either when the whole form is being cleared or a new task has been created. 
 */
function clearSubtaskList() {
    let subtaskList = document.getElementById('subtasklist');
    subtaskList.innerHTML = '';
}