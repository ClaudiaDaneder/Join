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
    let login = document.getElementById('login');
    let logoIMG = document.getElementById('logoIMG');
    let sign_up = document.getElementById('sign_up');
    let footer = document.getElementById('footer');
    let backgroundLogin = document.getElementById('backgroundLogin');
    setTimeout(() => {
        startJoin(logoIMG, backgroundLogin, login, sign_up, footer);
    }, 1000);
    login.innerHTML = loginstart();
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

/**
 * Set Design of Sign Up and set Form attribute 
 * 
 * This function triggers the animation of the change from login to the Sign up field
 * 
 * */
function sign_up() {
    document.title = 'Join Sign Up';
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

/**Sign Up Fade Out Animation */
function signUpStyle(animated, fadeIn, animated_Out, fadeOut) {
    let sign_up = document.getElementById('sign_up');
    sign_up.classList.remove(`${animated}`);
    sign_up.classList.remove(`${fadeIn}`);
    sign_up.classList.add(`${animated_Out}`);
    sign_up.classList.add(`${fadeOut}`);
}

/**
 * Set class form Style for Login and Sign Up 
 * 
 * This function changes the values ​​depending on the page
 * 
 * */
function loginFormStyle(height, gap, justifyContent, left) {
    let loginform = document.getElementById("loginForm");
    let checkbox = document.getElementById("checkbox");
    loginform.style.height = height;
    loginform.style.gap = gap;
    checkbox.style.justifyContent = justifyContent;
    checkbox.style.left = left;
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
    let img = document.getElementById('reme');
    let remeCheck = document.getElementById('remeCheck');
    if (remeCheck || save == 1) {
        remeCheck.src = './img/checked.svg';
        remeChecked = [1];
        remeCheck.id = 'reme';
        anable('1');
    } else if (img) {
        img.src = './img/unchecked.svg';
        remeChecked = [0];
        img.id = 'remeCheck';
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
    let img = document.getElementById(`${id}`);
    img.src = './img/password_dont.svg';
    img.setAttribute('onclick', `changeShow('${id}'); notClose(event)`);
    img.style.cursor = 'pointer';
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

/**
 * Set Password image default after body click 
 * 
 * This function resets the password input field on the login page to default when clicked outside of this field
 * 
 * */
function restoreIMG() {
    let img = document.getElementById("changePW");
    let pwInput = document.getElementById("passwordchangePW");
    pwInput.setAttribute('type', 'password');
    img.src = './img/password.svg';
    img.style.cursor = 'default';
}

/**
 * Set Password image default after body click 
 * 
 * This function resets the password input fields on the Sign Up page to default when clicked outside of these fields
 * 
 * */
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

/**
 * Check document ID for password 
 * 
 * This function checks whether you are on the login or sign up page
 * 
 * */
function pwIdInfo() {
    let pwLogin = document.getElementById("passwordchangePW");
    if (pwLogin == null) {
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
    let button = document.getElementById('anable');
    if (button != null) {
        if (activ == '1') {
            buttonStyle(false, 'buttonDisabled', 'button');
        } else {
            buttonStyle(true, 'button', 'buttonDisabled');
        }
    }
}

/**
 * Set button style 
 * 
 * This function changes the style of the Sign Up button depending on whether it is active or inactive
 * 
 * @param {false or true} disabledButton - disabled button with false and anable butten with true
 * @param {string} disabledSytle - classlist of add style
 * @param {string} anabledStyle -classlist of remove style 
 * 
 * */
function buttonStyle(disabledButton, anabledStyle, disabledSytle) {
    let button = document.getElementById('anable');
    button.disabled = disabledButton;
    button.classList.remove(`${anabledStyle}`);
    button.classList.add(`${disabledSytle}`);
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
    let backgroundLogin = document.getElementById('backgroundLogin');
    let logoIMG = document.getElementById('logoIMG');
    if (width <= 850) {
        backgroundLogin.classList.remove('backgroundLogin');
        backgroundLogin.classList.add('backgroundLoginMobile');
        if (goToMobile != 'goToMobile') { logoIMG.src = './img/join_logo.svg'; } else { logoIMG.src = './img/join_logo_dark.svg'; }
    } else {
        backgroundLogin.classList.remove('backgroundLoginMobile');
        backgroundLogin.classList.add('backgroundLogin');
        logoIMG.src = './img/join_logo_dark.svg';
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