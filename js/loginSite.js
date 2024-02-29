let loginData = [];
let remoteLoginData = [];
let daEmail = 'devAka@devAka.net';
let daPass = '12345678';

/**
 * This function checks the login data for accuracy 
 */
function userLogin() {
    if (checkEmaildata() == true) {
        if (checkPassData() == true) {
            saveLogin();
            window.open('summary.html', '_self');
        } else {
            wrongPassData();
        }
    } else {
        wrongEmailData();
    }
}

/**
 * This function passes the login data from the user DA 
 */
function daLogin() {
    if (checkEmaildata(daEmail) == true) {
        if (checkPassData(daEmail, daPass) == true) {
            saveLogin();
            window.open('summary.html', '_self');
        } else {
            wrongPassData();
        }
    } else {
        wrongEmailData();
    }
}

/**
 * This function compares the email address entered or that from the DA to see if it exists
 * 
 * @param {string} email - This variable passes the email address of the DA user
 * @returns - and returns true if correct
 * 
 */
function checkEmaildata(email) {
    let checkValue = checkValueEmail(email);
    for (let i = 0; i < user.length; i++) {
        let userMail = user[i]['email'];

        if (userMail.toLowerCase() == checkValue) {
            return true;
        }
    }
}

/**
 * This function compares the email address and password for accuracy in the user data
 * 
 * @param {string} email - This variable passes the email address of the DA user
 * @param {string} pass - This variable passes the password of the DA user
 * @returns - and returns true if correct
 * 
 */
function checkPassData(email, pass) {
    let checkValue = checkValueEmail(email);
    let checkPassValue = checkValuePass(pass);
    for (let i = 0; i < user.length; i++) {
        let userMail = user[i]['email'];
        let userPassword = user[i]['password'];
        if (userMail.toLowerCase() == checkValue) {
            if (userPassword == checkPassValue) {
                userOnlinesave(i);
                return true;
            }
        }
    }
}

/**
 * This function checks whether the entered or the DA email address is used
 * 
 * @param {string} email - This variable passes the email address of the DA user
 * @returns - and returns the emailadress
 * 
 */
function checkValueEmail(email) {
    let userEmail = doc('userEmail').value;
    if (email != undefined) {
        userEmail = email;
    }

    return userEmail.toLowerCase();
}

/**
 * This function checks whether the entered password or the DA password is used
 * 
 * @param {*} pass - This variable passes the password of the DA user
 * @returns - and returns the password
 * 
 */
function checkValuePass(pass) {
    let userPass = doc('passwordchangePW').value;
    if (pass != undefined) {
        userPass = pass;
    }

    return userPass;
}

/**
 * This function saves the data when you log in in Onlinestorage and send to localstorage save function 
 * 
 * @param {number} i - is the location in the array passed by checkPassData
 * 
 */
async function userOnlinesave(i) {
    await saveOnline(i);
    await setItem(`${contactsKey}`, JSON.stringify(user));
}

/**
 * diese funktion speichert die daten im localstorage
 * 
 * @param {number} i - is the location in the array passed by checkPassData
 * 
 */
async function saveOnline(i) {
    user[i]['online'] = true;
    localStorage.setItem('userOnline', JSON.stringify(user[i]['email']));
}

/**
 * This function prints the error message for the wrong email address and changes the design to red
 */
function wrongEmailData() {
    doc('wrongUserEmail').style.border = '1px solid red';
    doc('wrong').innerHTML = `Ups! Email wrong, Try again!`;
    setTimeout(() => {
        doc('wrongUserEmail').style.border = '1px solid #D1D1D1';
        doc('wrong').innerHTML = '';
        doc('userEmail').value = '';
    }, 2000);
}

/**
 * This function prints the error message for the wrong password and changes the design to red
 */
function wrongPassData() {
    doc('wrongUserPass').style.border = '1px solid red';
    doc('wrong').innerHTML = `Ups! Passwort wrong, Try again!`;
    setTimeout(() => {
        doc('wrongUserPass').style.border = '1px solid #D1D1D1';
        doc('wrong').innerHTML = '';
        doc('passwordchangePW').value = '';
    }, 2000);
}

/**
 * This function checks whether the login data has been saved
 */
function saveLogin() {
    if (remeChecked == 1) {
        saveLoginData();
    } else {
        deleteLoginData();
    }
}

/**
 * This function saves the login data in local storage
 */
function saveLoginData() {
    let data = [{
        'email': doc('userEmail').value,
        'password': doc('passwordchangePW').value,
    }];
    loginData = data;
    localStorage.setItem('loginData', JSON.stringify(loginData));
}

/**
 * This function deletes the login data in local storage
 */
function deleteLoginData() {
    loginData = null;
    localStorage.setItem('loginData', JSON.stringify(loginData));
}

/**
 * This function checks whether data is stored in local storage and passes it on to the rememberMe function
 */
function loadRememberMe() {
    load = JSON.parse(localStorage.getItem('loginData'));
    loginData = load;
    if (loginData != null) {
        loadLoginData();
        rememberMe(1);
    }
}

/**
 * This function loads the login data into the login field if it has been saved and passes the email on to the directLogin function
 */
function loadLoginData() {
    for (let i = 0; i < loginData.length; i++) {
        doc('userEmail').value = loginData[i]['email'];
        doc('passwordchangePW').value = loginData[i]['password'];
        directLogin(loginData[i]['email']);
    }
}

/**
 * This function checks whether the user is logged in and logs him in again directly
 */
function directLogin(email) {
    for (let i = 0; i < user.length; i++) {
        let userEmail = user[i]['email'];
        let userOnline = user[i]['online'];
        if (userEmail == email) {
            if (userOnline == true) {
                localStorage.setItem('userOnline', JSON.stringify(userEmail));
                window.open('summary.html', '_self');
            }
        }
    }
}