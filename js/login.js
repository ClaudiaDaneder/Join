let remeChecked = [0];
let user = [];
let contactsKey = 'allContacts';


async function init() {
    loadUsers();
    logoSize();
}

async function loadUsers() {
    try {
        user = JSON.parse(await getItem(`${contactsKey}`));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function logoSize() {
    let login = document.getElementById('login');
    let logoIMG = document.getElementById('logoIMG');
    let sign_up = document.getElementById('sign_up');
    setTimeout(() => {
        logoIMG.classList.add('selected');
        login.style.display = 'flex';
        sign_up.style.display = 'flex';
    }, 1000);
    login.innerHTML = loginstart();
}

function loginSite() {
    signUpStyle('animated_Ou', 'fadeOut', 'animated', 'fadeIn');
    loginStyle('493px', '652px', '48px 115px 48px 115px', loginstart());
    loginFormStyle('196px', '20px', 'flex-start', '39px');
    let form = document.getElementById('logSign');
    form.setAttribute('onsubmit', 'userLogin(); return false');
}

function sign_up() {
    signUpStyle('animated', 'fadeIn', 'animated_Out', 'fadeOut');
    loginStyle('550px', '598px', '48px 88px 48px 88px', sign_upStart());
    loginFormStyle('326px', '16px', 'center', 'unset');
    signUpLoad();
    let form = document.getElementById('logSign');
    form.setAttribute('onsubmit', 'checkPasswords(); return false');
}

function signUpStyle(animated, fadeIn, animated_Out, fadeOut) {
    let sign_up = document.getElementById('sign_up');
    sign_up.classList.remove(`${animated}`);
    sign_up.classList.remove(`${fadeIn}`);
    sign_up.classList.add(`${animated_Out}`);
    sign_up.classList.add(`${fadeOut}`);
}

function loginStyle(height, width, padding, site) {
    let login = document.getElementById('login');
    login.style.height = height;
    login.style.width = width;
    login.style.padding = padding;
    login.innerHTML = '';
    login.innerHTML = site;
}

function loginFormStyle(height, gap, justifyContent, left) {
    let loginform = document.getElementById("loginForm");
    let checkbox = document.getElementById("checkbox");
    loginform.style.height = height;
    loginform.style.gap = gap;
    checkbox.style.justifyContent = justifyContent;
    checkbox.style.left = left;
}

function rememberMe() {
    let img = document.getElementById('reme');
    let host = window.location.protocol + "//" + window.location.host;
    if (img.src == `${host}/img/unchecked.svg`) {
        img.src = './img/checked.svg';
        remeChecked = [1];
        anable('1');
    } else {
        img.src = './img/unchecked.svg';
        remeChecked = [0];
        anable('0');
    }
}

function changePWImg(id) {
    let img = document.getElementById(`${id}`);
    img.src = './img/password_dont.svg';
    img.setAttribute('onclick', `changeShow('${id}'); notClose(event)`);
    img.style.cursor = 'pointer';
}

function changeShow(id) {
    let pwInput = document.getElementById(`password${id}`);
    let img = document.getElementById(`${id}`);
    if (pwInput.type == 'password') {
        pwInput.setAttribute('type', 'text');
        img.src = './img/password_show.svg';
        img.style.cursor = 'pointer';
    } else {
        pwInput.setAttribute('type', 'password');
        img.src = './img/password_dont.svg';
        img.style.cursor = 'pointer';
    }
}

function restoreIMG() {
    let img = document.getElementById("changePW");
    let pwInput = document.getElementById("passwordchangePW");
    pwInput.setAttribute('type', 'password');
    img.src = './img/password.svg';
    img.style.cursor = 'default';
}

function restoreIMGSignUp() {
    let img = document.getElementById("changePWsign");
    let imgC = document.getElementById("changePWsignC");
    let pwInput = document.getElementById("passwordchangePWsign");
    let pwInputC = document.getElementById("passwordchangePWsignC");
    pwInput.setAttribute('type', 'password');
    pwInputC.setAttribute('type', 'password');
    img.src = './img/password.svg';
    img.style.cursor = 'default';
    imgC.src = './img/password.svg';
    imgC.style.cursor = 'default';
}

function pwIdInfo() {
    let pwLogin = document.getElementById("passwordchangePW");
    if (pwLogin == null) {
        restoreIMGSignUp();
    } else {
        restoreIMG();
    }
}

function anable(activ) {
    let button = document.getElementById('anable');
    if (button != null) {
        if (activ == '1') {
            buttonStyle(false, 'buttonDisabled', 'button');
        } else {
            buttonStyle(true, 'button', 'buttonDisabled');
        }
    }
}

function buttonStyle(disabledButton, anabledStyle, disabledSytle) {
    let button = document.getElementById('anable');
    button.disabled = disabledButton;
    button.classList.remove(`${anabledStyle}`);
    button.classList.add(`${disabledSytle}`);
}

function notClose(event) {
    event.stopPropagation();
}