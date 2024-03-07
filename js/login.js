let remeChecked = [0];
let user = [];
let contactsKey = 'allContacts';

async function init() {
    await widthSize();
    await loadUsers();
    logoSize();
}

/**
 * Load User from Online Storage 
 * 
 * @param {string} contactsKey - This is the variable of the key in the online storage
 * 
 * @param {array} user - This is the JSON Araay into which the data from the online storage is pushed
 */
async function loadUsers() {
    try {
        user = JSON.parse(await getItem(`${contactsKey}`));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Start Join with switch Logo 
 * 
 * This function creates the login page with the logo effect
 * 
 * */
async function logoSize() {
    setTimeout(() => {
        startJoin(doc('logoIMG'), doc('backgroundLogin'), doc('login'), doc('sign_up'), doc('footer'));
    }, 1000);
    doc('login').innerHTML = loginstart();
    loadRememberMe();
}

/**
 * Switch Logo and set screen elements 
 * 
 * This function sets a classlist so that the logo flies from the middle to the top left and shows the login field, sign up buttons and footer with a fade in animation
 * 
 * */
function startJoin(logoIMG, backgroundLogin, login, sign_up, footer) {
    logoIMG.classList.add('selected');
    setTimeout(() => {
        logoIMG.src = './img/join_logo_dark.svg';
    }, 400);
    backgroundLogin.classList.add('selectedBackground');
    login.style.display = 'flex';
    sign_up.style.display = 'flex';
    footer.style.display = 'flex';
}

/**
 * Set Design of Log in, set Form attribute and check the Remember me Function 
 * 
 * This function triggers the animation of the change from Sign Up to the login field
 * 
 * */
function loginSite() {
    document.title = 'Join Log in';
    doc('login').classList.remove('signUpSite');
    doc('login').classList.add('login');
    doc('login').innerHTML = '';
    doc('login').innerHTML = loginstart();
    signUpStyle('animated_Ou', 'fadeOut', 'animated', 'fadeIn');
    loginFormStyle('196px', '20px', 'flex-start', '39px');
    doc('logSign').setAttribute('onsubmit', 'userLogin(); return false');
    remeChecked = [];
    loadRememberMe();
}

/**
 * Set Design of Sign Up and set Form attribute 
 * 
 * This function triggers the animation of the change from login to the Sign up field
 * 
 * */
function sign_up() {
    document.title = 'Join Sign Up';
    doc('login').classList.remove('login');
    doc('login').classList.add('signUpSite');
    doc('login').innerHTML = '';
    doc('login').innerHTML = sign_upStart();
    signUpStyle('animated', 'fadeIn', 'animated_Out', 'fadeOut');
    loginFormStyle('326px', '16px', 'center', 'unset');
    doc('logSign').setAttribute('onsubmit', 'checkRememberMeClick(); return false');
    remeChecked = [];
}

/**Sign Up Fade Out Animation */
function signUpStyle(animated, fadeIn, animated_Out, fadeOut) {
    doc('sign_up').classList.remove(`${animated}`);
    doc('sign_up').classList.remove(`${fadeIn}`);
    doc('sign_up').classList.add(`${animated_Out}`);
    doc('sign_up').classList.add(`${fadeOut}`);
}

/**
 * Set class form Style for Login and Sign Up 
 * 
 * This function changes the values ​​depending on the page
 * 
 * */
function loginFormStyle(height, gap, justifyContent, left) {
    doc('loginForm').style.height = height;
    doc('loginForm').style.gap = gap;
    doc('checkbox').style.justifyContent = justifyContent;
    doc('checkbox').style.left = left;
}

/**
 * Check Remember Data of User 
 * 
 * This function checks whether the user has saved his login data
 * 
 * @param {number} save - Here the value 1 is transferred for saved login data or Sign Up accept Privacy Policy
 * 
 * @function anable - returns the value 1 or 0
 * 
 * 
 * */
function rememberMe(save) {
    if (doc('remeCheck') || save == 1) {
        doc('remeCheck').src = './img/checked.svg';
        remeChecked = [1];
        doc('remeCheck').id = 'reme';
        anable('1');
    } else if (doc('reme')) {
        doc('reme').src = './img/unchecked.svg';
        remeChecked = [0];
        doc('reme').id = 'remeCheck';
        anable('0');
    }
}

/**
 * Change Password Image and set attribute 
 * 
 * This function changes the image, the onclick attribute and sets the cursor to pointer
 * 
 * @param {string} id - this is the id of html document
 * 
 * */
function changePWImg(id) {
    doc(`${id}`).src = './img/password_dont.svg';
    doc(`${id}`).setAttribute('onclick', `changeShow('${id}'); notClose(event)`);
    doc(`${id}`).style.cursor = 'pointer';
}

/**
 * Show or not Show Password after Onclick of Image 
 * 
 * This function changes the image, the attribute type from password to text and back again when you click on the image
 * 
 * @param {string} id - this is the id of html document
 * 
 * */
function changeShow(id) {
    if (doc(`password${id}`).type == 'password') {
        doc(`password${id}`).setAttribute('type', 'text');
        doc(`${id}`).src = './img/password_show.svg';
        doc(`${id}`).style.cursor = 'pointer';
    } else {
        doc(`password${id}`).setAttribute('type', 'password');
        doc(`${id}`).src = './img/password_dont.svg';
        doc(`${id}`).style.cursor = 'pointer';
    }
}

/**
 * Set Password image default after body click 
 * 
 * This function resets the password input field on the login page to default when clicked outside of this field
 * 
 * */
function restoreIMG() {
    doc('passwordchangePW').setAttribute('type', 'password');
    doc('changePW').src = './img/password.svg';
    doc('changePW').style.cursor = 'default';
}

/**
 * Set Password image default after body click 
 * 
 * This function resets the password input fields on the Sign Up page to default when clicked outside of these fields
 * 
 * */
function restoreIMGSignUp() {
    doc('passwordchangePWsign').setAttribute('type', 'password');
    doc('passwordchangePWsignC').setAttribute('type', 'password');
    doc('changePWsign').src = './img/password.svg';
    doc('changePWsign').style.cursor = 'default';
    doc('changePWsignC').src = './img/password.svg';
    doc('changePWsignC').style.cursor = 'default';
}

/**
 * Check document ID for password 
 * 
 * This function checks whether you are on the login or sign up page
 * 
 * */
function pwIdInfo() {
    if (doc('passwordchangePW') == null) {
        restoreIMGSignUp();
    } else {
        restoreIMG();
    }
}

/**
 * Check the button Activ 
 * 
 * This function only releases the sign-up button once the privacy policy has been accepted
 * 
 * @param {string} activ - This is the value 1 or 0 to activate or deactivate the button
 * 
 * */
function anable(activ) {
    if (doc('anable') != null) {
        if (activ == '1') {
            buttonStyle('buttonDisabled', 'button');
        } else {
            buttonStyle('button', 'buttonDisabled');
        }
    }
}

/**
 * Set button style 
 * 
 * This function changes the style of the Sign Up button depending on whether it is active or inactive
 * 
 * @param {string} disabledButton - disabled button with false and anable butten with true
 * @param {string} disabledSytle - classlist of add style
 * @param {string} anabledStyle -classlist of remove style 
 * 
 * */
function buttonStyle(anabledStyle, disabledSytle) {
    doc('anable').classList.remove(`${anabledStyle}`);
    doc('anable').classList.add(`${disabledSytle}`);
}

/**
 * Not close Event 
 * 
 * This function prevents closing a popup when clicking on certain levels
 * 
*/
function notClose(event) {
    event.stopPropagation();
}

/**
 * Check width for mobile oder Desktop 
 * 
 * This function checks the screen width when on the function
 * 
 * @param clientWidth - the size of the user screen
 * @param {string} goToMobile - is the value for changing the logo
 * 
 * */
async function widthSize(goToMobile) {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width <= 850) {
        doc('backgroundLogin').classList.remove('backgroundLogin');
        doc('backgroundLogin').classList.add('backgroundLoginMobile');
        if (goToMobile != 'goToMobile') { doc('logoIMG').src = './img/join_logo.svg'; } else { doc('logoIMG').src = './img/join_logo_dark.svg'; }
    } else {
        doc('backgroundLogin').classList.remove('backgroundLoginMobile');
        doc('backgroundLogin').classList.add('backgroundLogin');
        doc('logoIMG').src = './img/join_logo_dark.svg';
    }
}

/**
 * Event Listener for Width 
 * 
 * This event listener triggers the function for widthSize and sends the string goToMobile
 * 
 * */
window.addEventListener("resize", function () {
    widthSize('goToMobile');
});