/**
 * This function checks whether the passwords entered are identical
 * If an error occurs, the input fields that affect it will be marked red
 */
function checkPasswords() {
    if (doc('passwordchangePWsign').value == doc('passwordchangePWsignC').value) {
        checkEmail();
    } else {
        doc('pwwrong').style.border = '1px solid red';
        doc('wrong').innerHTML = 'Ups! your password don’t match';
        setTimeout(() => {
            doc('pwwrong').style.border = '1px solid #D1D1D1';
            doc('wrong').innerHTML = '';
            doc('passwordchangePWsign').value = '';
            doc('passwordchangePWsignC').value = '';
        }, 2000);
    }
}

/**
 * This function checks whether the email address entered exists
 */
function checkEmail() {
    if (checkEmailExist() == true) {
        emailExist();
    } else {
        register();
    }
}

/**
 * This function returns true if the email exists
 * */
function checkEmailExist() {
    let emailLow = doc('email').value.toLowerCase();
    for (let i = 0; i < user.length; i++) {
        let emailExist = user[i]['email'];
        if (emailExist.toLowerCase() === emailLow) {
            return true;
        }
    }
}

/**
 * This function changes the input field to red for an existing email address
 * */
function emailExist() {
    doc('emailwrong').style.border = '1px solid red';
    doc('wrong').innerHTML = 'Ups! email already exists';
    setTimeout(() => {
        doc('emailwrong').style.border = '1px solid #D1D1D1';
        doc('wrong').innerHTML = '';
        doc('email').value = '';
    }, 2000);
}

/**
 * This function pushes the data into a json array and then stores it in remote storage, spears the sign up button and empties the form
 */
async function register() {
    doc('disabled').disabled = true;
    let idShow = searchId();
    let colorCreate = getColor(1, 9);
    user.push({
        'id': idShow,
        'name': doc('name').value,
        'email': doc('email').value,
        'phone': '',
        'color': colorCreate,
        'online': false,
        'password': doc('passwordchangePWsign').value,
    });
    await setItem(`${contactsKey}`, JSON.stringify(user));
    resetForm();
}

/**
 * This function looks for the id in the last array and adds 1 to it to create the next id 
 * */
function searchId() {
    lastID = user[user.length - 1];
    if (lastID == null || lastID == '') {
        lastID = 0;
    } else {
        lastID = lastID['id'];
    }
    return lastID + 1;
}

/**
 * This function outputs a random number from 1 - 9 
 * (in this case the min value 1 and max value 9 are passed from the register function) to the searchColor function
 * and then gives it back
 * 
 * @param floor - floor rounds the number
 * @param random - function for random
 * @param math - function for numbers
 * 
 * */
function getColor(min, max) {
    color = Math.floor(Math.random() * (max - min + 1)) + min;
    let number = searchColor(color);
    return number;
}

/**
 * This function compares the numbers and returns the appropriate color
 * 
 * @param {number} color - number passed by getColor
 * @returns - names of the colors in the css class
 * 
 */
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

/**
 * This function changes the style value and loads the login page
 */
function savePopupSign() {
    doc('secSign').style.transform = 'translatex(0)';
    setTimeout(() => {
        doc('secSign').style.transform = 'translatex(150vw)';
        loginSite();
    }, 1500);
}

/**
 * This function empties the form of the sign up page
 */
function resetForm() {
    savePopupSign();
    doc('name').value = '';
    doc('email').value = '';
    doc('passwordchangePWsign').value = '';
    doc('passwordchangePWsignC').value = '';
    doc('disabled').disabled = false;
}