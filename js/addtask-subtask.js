function updateSubtaskButtons() {
    if (subtaskField.value === '') {
        document.getElementById('subtaskfield-buttons').innerHTML = showPlusButton();

    } else {
        document.getElementById('subtaskfield-buttons').innerHTML = showClearOrAddButtons();
    }
}

function showPlusButton() {
    return `<button type="button" class="subtaskfield-button-general"><img src="/img/addtask_icon_subtaskfield_plus.svg"></button>`;
}

function showClearOrAddButtons() {
    return `<button type="button" class="subtaskfield-button-general" onclick="clearSubtaskField()"><img src="/img/addtask_icon_subtaskfield_cancel.svg"></button><hr><button type="button" class="subtaskfield-button-general" onclick="addToSubtasks()"><img src="/img/addtask_icon_subtaskfield_check.svg"></button></div>`;
}


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
        subtaskList.innerHTML += showSubtaskItem(i, subtask)
    }
}

function showSubtaskItem(i, subtask) {
    return `<div class="subtasklist-item" id="subtasklist-item_${i}" ondblclick="editSubtasklistItem(${i})" onmouseenter="showEditButtons(${i})" onmouseleave="showEditButtons(${i})">
    <div class="subtasklist-infos"><div class="subtasklist-marker">•</div>${subtask}</div>
    <div id="edit-buttons_${i}" class="subtaskfield-button-container hide">
        <button class="subtaskfield-button-general" type="button" onclick="editSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_edit.svg"></button>
        <hr>
        <button class="subtaskfield-button-general" type="button" onclick="deleteSubtasklistItem(${i})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
    </div>`;
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

        let newHTML = showSubtaskItemEditField(subtaskText, s);
        listItem.innerHTML = newHTML;
        let editField = document.getElementById('editfield');
        if (editField) {
            moveCursorToEnd(editField);
        }
    }
}

function showSubtaskItemEditField(subtaskText, s) {
    return `<div class="styled-subtaskitem-edit-input">
        <input class="subtaskitem-edit-input" type="text" id="editfield" value="${subtaskText}">
        <div class="subtaskfield-button-container">
            <button type="button" class="subtaskfield-button-general" onclick="deleteSubtasklistItem(${s})"><img src="/img/addtask_icon_subtask_delete.svg"></button>
            <button type="button" class="subtaskfield-button-general" onclick="updateSubtasklistItem(${s})"><img src="/img/addtask_icon_subtaskfield_check.svg"></button>
        </div>
    </div>`;
}


function subtaskfieldFocus() {
    document.getElementById('styled-subtaskfield').classList.toggle('subtaskfield-focus')
}


function subtaskfieldBlur() {
    document.getElementById('styled-subtaskfield').classList.remove('subtaskfield-focus')
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
    }, 100);
}


function clearSubtaskField() {
    subtaskField.value = '';
    updateSubtaskButtons()
}


function clearSubtaskList() {
    subtaskList.innerHTML = '';
}