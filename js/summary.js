async function initSummary() {
    greet();
    await includeHTML();
    await initOnline();
    showMetrics()
    await enableNavigation();
    navigation('show');
}

function greet() {
    let today = new Date();
    let time = today.getHours();
    let greet;

    if (time < 6) {
        greet = 'Good night,&nbsp;';
    } else if (time < 12) {
        greet = 'Good morning,&nbsp;';
    } else if (time < 18) {
        greet = 'Good afternoon,&nbsp;';
    } else if (time < 24) {
        greet = 'Good evening,&nbsp;';
    };

    /*if (login name is "user") {
        greet.replace(", &nbsp;", '!');
        dont display name
    }
    */

    let message = document.getElementById('greeting-time');
    message.innerHTML = greet;
    let messageMobile = document.getElementById('greeting-time-mobile');
    messageMobile.innerHTML = greet;
    hideMobileGreetingAfterTimeout();
}

function hideMobileGreetingAfterTimeout() {
    setTimeout(function () {
        document.getElementById('mobile-greeting').style = 'display: none';
    }, 1600);
}

function changeFieldColor(field) {
    let circle = document.getElementById(`${field}`);
    circle.style.backgroundColor = '#fff';
    circle.style.backgroundImage = `url(./img/summary_${field}_dark.svg)`;
}

function resetFieldColor(field) {
    let circle = document.getElementById(`${field}`);
    circle.style.backgroundColor = '#2A3647';
    circle.style.backgroundImage = `url(./img/summary_${field}_white.svg)`;
}

function changeNumberColor(field) {
    let number = document.getElementById(`number_${field}`);
    number.classList.add('white');
}

function resetNumberColor(field) {
    let number = document.getElementById(`number_${field}`);
    number.classList.remove('white');
}

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

async function getData() {
    await loadTaskFromStorage();
    await fillTasks();
}

function showUserName() {
    let userName = onlineName[0];
    document.getElementById('greeting-name').innerHTML = userName;
    document.getElementById('greeting-name-mobile').innerHTML = userName;
}

function showToDos() {
    let number = toDos.length;
    document.getElementById('number_todo').innerHTML = number;
}

function showDone() {
    let number = done.length;
    document.getElementById('number_done').innerHTML = number;
}

function showTasksInBoard() {
    let number = allTasks.length;
    document.getElementById('number_tasks-in-board').innerHTML = number;
}

function showTasksInProgress() {
    let number = inProgress.length;
    document.getElementById('number_tasks-in-progress').innerHTML = number;
}

function showAwaitingFeedback() {
    let number = awaitFeedback.length;
    document.getElementById('number_awaiting-feedback').innerHTML = number
}


function getEarliestDate() {
    let openTasks = allTasks.filter(function (task) {
        return task.status !== 'done';
    });
    if (openTasks.length === 0) {
        hideDeadlineSection()
    }
    let earliestDate = new Date(openTasks[0]['due-date']).getTime();
    for (let i = 1; i < openTasks.length; i++) {
        let date = new Date(openTasks[i]['due-date']).getTime();
        if (date < earliestDate) {
            earliestDate = date;
        }
    }
    return formatDate(new Date(earliestDate));
}


function hideDeadlineSection() {
    document.getElementById('urgent-right').style = 'display: none';
    document.getElementById('urgent-line').style = 'display: none';
}


function formatDate(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let formattedDate = month + ' ' + day + ' ,' + year;
    return formattedDate;
}


function showUpcomingDeadline() {
    let deadline = getEarliestDate();
    document.getElementById('deadline').innerHTML = deadline;
}


function showUrgentTasks() {
    let urgentTasks = allTasks.filter(function (task) {
        return task.prio === 'urgent' && task.status !== 'done';
    });
    let number = urgentTasks.length;
    document.getElementById('number_urgent').innerHTML = number;
}