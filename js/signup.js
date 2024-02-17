let user = [];
let contactsKey = 'allContacts';


async function signUpLoad() {
    loadUsers();
}

async function loadUsers() {
    try {
        user = JSON.parse(await getItem(`${contactsKey}`));
        console.log(user);
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function checkPasswords() {
    let password = document.getElementById('passwordchangePWsign');
    let passwordC = document.getElementById('passwordchangePWsignC');
    let pwwrong = document.getElementById('pwwrong');
    let wrong = document.getElementById('wrong');
    if (password.value == passwordC.value) {
        checkEmail();
    } else {
        pwwrong.style.border = '1px solid red';
        wrong.innerHTML = 'Ups! your password don’t match';
        setTimeout(() => {
            pwwrong.style.border = '1px solid #D1D1D1';
            wrong.innerHTML = '';
            password.value = '';
            passwordC.value = '';
        }, 2000);
    }
}

function checkEmail() {
    if (checkEmailExist() == true) {
        emailExist();
    } else {
        register();
    }
}

function checkEmailExist() {
    let email = document.getElementById('email');
    let emailLow = email.value.toLowerCase();
    for (let i = 0; i < user.length; i++) {
        let emailExist = user[i]['email'];
        if (emailExist.toLowerCase() === emailLow) {
            return true;
        }
    }
}

function emailExist() {
    let email = document.getElementById('email');
    let emailwrong = document.getElementById('emailwrong');
    let wrong = document.getElementById('wrong');
    emailwrong.style.border = '1px solid red';
    wrong.innerHTML = 'Ups! email already exists';
    setTimeout(() => {
        emailwrong.style.border = '1px solid #D1D1D1';
        wrong.innerHTML = '';
        email.value = '';
    }, 2000);
}

async function register() {
    let registerBtn = document.getElementById('disabled');
    registerBtn.disabled = true;
    let idShow = searchId();
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let colorCreate = getColor(1, 9);
    let password = document.getElementById('passwordchangePWsign');
    user.push({
        'id': idShow,
        'name': name.value,
        'email': email.value,
        'phone': '',
        'color': colorCreate,
        'online': false,
        'password': password.value,
    });
    await setItem(`${contactsKey}`, JSON.stringify(user));
    resetForm();
}

function searchId() {
    lastID = user.length;
    if (lastID == null || lastID == '') lastID = 0;
    return lastID + 1;
}

function getColor(min, max) {
    color = Math.floor(Math.random() * (max - min + 1)) + min;
    let number = searchColor(color);
    return number;
}

function searchColor(color) {
    if (color == 1) { return 'darkorange'; } else
        if (color == 2) { return 'orange'; } else
            if (color == 3) { return 'lightorange'; } else
                if (color == 4) { return 'pink'; } else
                    if (color == 5) { return 'lightpink'; } else
                        if (color == 6) { return 'lightpurple'; } else
                            if (color == 7) { return 'purple'; } else
                                if (color == 8) { return 'blue'; } else
                                    if (color == 9) { return 'cyan'; }
}

function savePopup() {
    let savePopup = document.getElementById('secSign');
    savePopup.style.transform = 'translatex(0)';
    setTimeout(() => {
        savePopup.style.transform = 'translatex(150vw)';
        loginstart();
    }, 1500);
}

function resetForm() {
    savePopup();
    let registerBtn = document.getElementById('disabled');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('passwordchangePWsign');
    let passwordC = document.getElementById('passwordchangePWsignC');
    name.value = '';
    email.value = '';
    password.value = '';
    passwordC.value = '';
    registerBtn.disabled = false;
}