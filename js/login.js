let remeChecked = [0];
let user = [];
let contactsKey = 'allContacts';


async function init() {
    await widthSize();
    await loadUsers();
    logoSize();
}

async function loadUsers() {
    try {
        user = JSON.parse(await getItem(`${contactsKey}`));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function logoSize() {
    let login = document.getElementById('login');
    let logoIMG = document.getElementById('logoIMG');
    let sign_up = document.getElementById('sign_up');
    let footer = document.getElementById('footer');
    let backgroundLogin = document.getElementById('backgroundLogin');
    setTimeout(() => {
        logoIMG.classList.add('selected');
        setTimeout(() => {
            logoIMG.src = './img/join_logo_dark.svg';
        }, 400);
        backgroundLogin.classList.add('selectedBackground');
        login.style.display = 'flex';
        sign_up.style.display = 'flex';
        footer.style.display = 'flex';
    }, 1000);
    login.innerHTML = loginstart();
    loadRememberMe();
}

function loginSite() {
    let login = document.getElementById('login');
    login.classList.remove('signUpSite');
    login.classList.add('login');
    login.innerHTML = '';
    login.innerHTML = loginstart();
    signUpStyle('animated_Ou', 'fadeOut', 'animated', 'fadeIn');
    loginFormStyle('196px', '20px', 'flex-start', '39px');
    let form = document.getElementById('logSign');
    form.setAttribute('onsubmit', 'userLogin(); return false');
    remeChecked = [];
    loadRememberMe();
}

function sign_up() {
    let login = document.getElementById('login');
    login.classList.remove('login');
    login.classList.add('signUpSite');
    login.innerHTML = '';
    login.innerHTML = sign_upStart();
    signUpStyle('animated', 'fadeIn', 'animated_Out', 'fadeOut');
    loginFormStyle('326px', '16px', 'center', 'unset');
    let form = document.getElementById('logSign');
    form.setAttribute('onsubmit', 'checkPasswords(); return false');
    remeChecked = [];
}

function signUpStyle(animated, fadeIn, animated_Out, fadeOut) {
    let sign_up = document.getElementById('sign_up');
    sign_up.classList.remove(`${animated}`);
    sign_up.classList.remove(`${fadeIn}`);
    sign_up.classList.add(`${animated_Out}`);
    sign_up.classList.add(`${fadeOut}`);
}

function loginFormStyle(height, gap, justifyContent, left) {
    let loginform = document.getElementById("loginForm");
    let checkbox = document.getElementById("checkbox");
    loginform.style.height = height;
    loginform.style.gap = gap;
    checkbox.style.justifyContent = justifyContent;
    checkbox.style.left = left;
}

function rememberMe(save) {
    let img = document.getElementById('reme');
    let remeCheck = document.getElementById('remeCheck');
    if (remeCheck || save == 1) {
        remeCheck.src = './img/checked.svg';
        remeChecked = [1];
        remeCheck.id = 'reme';
        anable('1');
    } else if(img){
        img.src = './img/unchecked.svg';
        remeChecked = [0];
        img.id = 'remeCheck';
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


async function widthSize(){
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let backgroundLogin = document.getElementById('backgroundLogin');
    let logoIMG = document.getElementById('logoIMG');
    if (width <= 780) {
        backgroundLogin.classList.remove('backgroundLogin');
        backgroundLogin.classList.add('backgroundLoginMobile');
        logoIMG.src = './img/join_logo.svg';
    } else {
        backgroundLogin.classList.remove('backgroundLoginMobile');
        backgroundLogin.classList.add('backgroundLogin');
        logoIMG.src = './img/join_logo_dark.svg';
    }
}
/*
window.addEventListener("resize", function () {
    init();
});*/