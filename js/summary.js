function initSummary() {
    greet();
    initOnline()
}

function greet() {
    let today = new Date();
    let time = today.getHours();
    let greet;

    if (time > 18) {
        greet = 'Good evening,';
    } else if (time > 12) {
        greet = 'Good afternoon,';
    } else if (time > 6) {
        greet = 'Good morning,';
    } else {
        greet = 'Good night,';
    }

    let message = document.getElementById('greeting-time');
    message.innerHTML = greet;
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

