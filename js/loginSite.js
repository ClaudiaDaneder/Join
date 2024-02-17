function userLogin() {
    if (checkEmaildata() == true) {
        if (checkPassData() == true) {
            window.open('summary.html', '_self');
        } else {
            wrongPassData();
        }
    } else {
        wrongEmailData();
    }
}

function checkEmaildata() {
    let userEmail = document.getElementById('userEmail');

    for (let i = 0; i < user.length; i++) {
        let userMail = user[i]['email'];

        if (userMail.toLowerCase() == userEmail.value.toLowerCase()) {
            return true;
        }
    }
}

function checkPassData() {
    let userEmail = document.getElementById('userEmail');
    let userPass = document.getElementById('passwordchangePW');

    for (let i = 0; i < user.length; i++) {
        let userMail = user[i]['email'];
        let userPassword = user[i]['password'];

        if (userMail.toLowerCase() == userEmail.value.toLowerCase()) {
            if (userPassword == userPass.value) {
                userOnlinesave(i);
                return true;
            }
        }
    }
}

async function userOnlinesave(i){
    user[i]['online'] = true;
    await setItem(`${contactsKey}`, JSON.stringify(user));
}
function wrongEmailData() {
    let emailData = document.getElementById('userEmail');
    let div = document.getElementById('wrongUserEmail');
    let wrong = document.getElementById('wrong');
    div.style.border = '1px solid red';
    wrong.innerHTML = `Ups! Email wrong, Try again!`;
    setTimeout(() => {
        div.style.border = '1px solid #D1D1D1';
        wrong.innerHTML = '';
        emailData.value = '';
    }, 2000);
}

function wrongPassData() {
    let passData = document.getElementById('passwordchangePW');
    let div = document.getElementById('wrongUserPass');
    let wrong = document.getElementById('wrong');
    div.style.border = '1px solid red';
    wrong.innerHTML = `Ups! Passwort wrong, Try again!`;
    setTimeout(() => {
        div.style.border = '1px solid #D1D1D1';
        wrong.innerHTML = '';
        passData.value = '';
    }, 2000);
}