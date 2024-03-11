async function initSummary() {
    greet();
    await includeHTML();
    await initOnline();
    showMetrics()
    await enableNavigation();
    navigation('show');
}

/**
 * This function is used to execute the function of greeting the user either on mobile or desktop.
 */
function greet() {
    let greeting = defineDayTime();

    let message = document.getElementById('greeting-time');
    message.innerHTML = greeting;

    let messageMobile = document.getElementById('greeting-time-mobile');
    messageMobile.innerHTML = greeting;

    hideMobileGreetingAfterTimeout();
}

/**
 * This function is used to determine the current time of day and to adjust the greeting message accordingly.
 * 
 * @returns string
 */
function defineDayTime() {
    let today = new Date();
    let time = today.getHours();
    let greeting;

    if (time < 6) {
        greeting = 'Good night,&nbsp;';
    } else if (time < 12) {
        greeting = 'Good morning,&nbsp;';
    } else if (time < 18) {
        greeting = 'Good afternoon,&nbsp;';
    } else if (time < 24) {
        greeting = 'Good evening,&nbsp;';
    };
    return greeting;
}

/**
 * This function is used to hide the greeting screen after a certain time, in case used in the mobile version.
 */
function hideMobileGreetingAfterTimeout() {
    setTimeout(function () {
        document.getElementById('mobile-greeting').style = 'display: none';
    }, 1600);
}

/**
 * This function executes all separate functions to show sepcific data on the dashboard.
 */
async function showMetrics() {
    showUserName();
    await getData();
    showUpcomingDeadline();
    showToDos();
    showDone();
    showUrgentTasks();
    showTasksInBoard();
    showTasksInProgress();
    showAwaitingFeedback();
}

/**
 * This function fetches the required data from the remote storage.
 */
async function getData() {
    await loadTaskFromStorage();
    await fillTasks();
}

/**
 * This function sets the name of the person currently logged in as the user name, and uses it in the greeting.
 */
async function showUserName() {
    let userName = await onlineName[0];
    document.getElementById('greeting-name').innerHTML = userName;
    document.getElementById('greeting-name-mobile').innerHTML = userName;
}

/**
 * This function determines the number of tasks with the status "to do" and puts the number in the according field on the dashboard. 
 */
function showToDos() {
    let number = toDos.length;
    document.getElementById('number_todo').innerHTML = number;
}

/**
 * This function determines the number of tasks with the status "done" and puts the number in the according field on the dashboard. 
 */
function showDone() {
    let number = done.length;
    document.getElementById('number_done').innerHTML = number;
}

/**
 * This function determines the total number of tasks on the board and puts it int the according field on the dashboard.
 */
function showTasksInBoard() {
    let number = allDownloadTasks.length;
    document.getElementById('number_tasks-in-board').innerHTML = number;
}

/**
 * This function determines the number of tasks with the status "in progress" and puts the number in the according field on the dashboard. 
 */
function showTasksInProgress() {
    let number = inProgress.length;
    document.getElementById('number_tasks-in-progress').innerHTML = number;
}

/**
 * This function determines the number of tasks with the status "awaiting feedback" and puts the number in the according field on the dashboard. 
 */
function showAwaitingFeedback() {
    let number = awaitFeedback.length;
    document.getElementById('number_awaiting-feedback').innerHTML = number
}

/**
 * This function determines the number of tasks with the priority "urgent" and puts the number in the according field on the dashboard. 
 */
function showUrgentTasks() {
    let urgentTasks = allDownloadTasks.filter(function (task) {
        return task.prio === 'urgent' && task.status !== 'done';
    });
    let number = urgentTasks.length;
    document.getElementById('number_urgent').innerHTML = number;
}

/**
 * This function is used to determine the nearest future due date within all open tasks. If there are no open tasks, or there is no due date in the future, the whole section of "upcoming deadline" will be hidden.
 * 
 * @returns string (date)
 */
function getEarliestDate() {
    let openTasks = filterOpenTasks();
    if (openTasks.length === 0) {
        hideDeadlineSection();
    }
    let today = new Date();
    let earliestFutureDate = Infinity;
    for (let i = 0; i < openTasks.length; i++) {
        let dueDate = new Date(openTasks[i]['due-date']);
        if (dueDate >= today && dueDate < earliestFutureDate) {
            earliestFutureDate = dueDate;
        }
    }
    if (earliestFutureDate === Infinity) {
        hideDeadlineSection();
    } else {
        return formatDate(new Date(earliestFutureDate));
    }
}

/**
 * This function is used to filter out all tasks that are still open, i.e. don't have the status "done".
 * 
 * @returns string
 */
function filterOpenTasks() {
    return allDownloadTasks.filter(function (task) {
        return task.status !== 'done';
    });
}

/**
 * This function is used to hide the section "upcoming deadline". 
 */
function hideDeadlineSection() {
    document.getElementById('urgent-right').style = 'display: none';
    document.getElementById('urgent-line').style = 'display: none';
}

/**
 * This function is used to format the date into the required form: "month day, year"
 * 
 * @param {Date} date 
 * @returns 
 */
function formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let formattedDate = month + ' ' + day + ', ' + year;
    return formattedDate;
}

/**
 * This function is used to display the nearest upcoming deadline within open tasks.
 */
function showUpcomingDeadline() {
    let deadline = getEarliestDate();
    document.getElementById('deadline').innerHTML = deadline;
}

/**
 * This function is used to change the background color and background image of the respective fields on the dashboard when the user hovers over them.
 * 
 * @param {string} field 
 */
function changeFieldColor(field) {
    let circle = document.getElementById(`${field}`);
    circle.style.backgroundColor = '#fff';
    circle.style.backgroundImage = `url(./img/summary_${field}_dark.svg)`;
}

/**
 * This function is used to reset the background color and background image to the default when the mouse leaves the respective field.
 * 
 * @param {string} field 
 */
function resetFieldColor(field) {
    let circle = document.getElementById(`${field}`);
    circle.style.backgroundColor = '#2A3647';
    circle.style.backgroundImage = `url(./img/summary_${field}_white.svg)`;
}

/**
 * This function adds the CSS class "white" to the number of the respective field when the user hovers over it.
 * 
 * @param {string} field 
 */
function changeNumberColor(field) {
    let number = document.getElementById(`number_${field}`);
    number.classList.add('white');
}

/**
 * This function is used to remove the CSS class "white" from the number of the respective field when the mouse leaves the field.
 * 
 * @param {string} field 
 */
function resetNumberColor(field) {
    let number = document.getElementById(`number_${field}`);
    number.classList.remove('white');
}
/**
 * This function is used to close the user popup on the header.
 */
function closePopup() {
    if (doc('logoutScreen').style.display == 'flex') {
        doc('logoutScreen').style.display = 'none';
    }
}

/**
 * This function redirects the user to the board after a short timeout.
 */
function redirectToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 100);
}