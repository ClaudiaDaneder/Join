async function initSummary() {
    greet();
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}

function greet() {
    let today = new Date();
    let time = today.getHours();
    let greet;

    if (time < 6) {
        greet = 'Good night,';
    } else if (time < 12) {
        greet = 'Good morning,';
    } else if (time < 18) {
        greet = 'Good afternoon,';
    } else if (time < 24) {
        greet = 'Good evening,';
    };

    /*if (login name is "user") {
        greet.replace(", ", '!')
    }
    */

    let message = document.getElementById('greeting-time');
    message.innerHTML = greet;
    let messageMobile = document.getElementById('greeting-time-mobile');
    messageMobile.innerHTML = greet;
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

