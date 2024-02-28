let onlineUser = [];
let yourId;
let onlineName = [];

async function initOnline() {
    await loadOnlineUsers();
    initals();
    widthSize();
}

/**
 * Load All User as Online Storage and Online Status as Local Storage 
 * 
 * @param {string} contactsKey - This is the variable of the key in the online storage
 * 
 * @param {array} onlineUser - This is the JSON Araay into which the data from the online storage is pushed
 */
async function loadOnlineUsers() {
    try {
        onlineUser = JSON.parse(await getItem(`${contactsKey}`));
        yourId = await JSON.parse(localStorage.getItem('userOnline'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function find Log Status 
 * 
 * @param {string} userFind - This is the variable to find the User are Online
 * 
 * */
function logout(userFind) {
    if (userFind != 'guest') {
        userOnline();
    } else {
        window.open('index.html', '_self');
    }
}

/**
 * This function Log User out and clear Data Online- and Localstorage 
 * 
 * @param {string} yourId - User ID are saved in Localstorage an delete this
 * 
 * */
async function userOnline() {
    for (let i = 0; i < onlineUser.length; i++) {
        let userID = onlineUser[i]['email'];
        if (yourId == userID) {
            onlineUser[i]['online'] = false;
            await setItem('allContacts', JSON.stringify(onlineUser));
            localStorage.setItem('userOnline', JSON.stringify(null));
            window.open('index.html', '_self');
        }
    }
}

/**
 * This function Set Initals in Header button 
 * */
async function initals() {
    if (yourId != null) {
        await setUserData();
    } else {
        doc('initals').innerHTML = 'G';
        doc('logoutButton').setAttribute('onclick', `logout('guest')`);
    }
}

/**
 * This function Save User Name in onlineName, Split name to Initails and and Set Attribute from logout Button
 * 
 * @param {string} names.split - Splits the first and last name to create 2 strings
 * @param {string} nameParts.map - keeps only the first letter and removes the rest
 * 
 * */
async function setUserData(){
    for (let i = 0; i < onlineUser.length; i++) {
        if (onlineUser[i]['email'] == yourId) {
            names = onlineUser[i]['name'];
            onlineName.push(names);
            let nameParts = names.split(" ");
            doc('initals').innerHTML = nameParts.map(part => part.charAt(0)).join("");
            doc('logoutButton').setAttribute('onclick', `logout('${yourId}')`);
        }
    }
}

/**
 * Function for show Screen of Logout, Privacy Policy and Legal Notice 
 * */
function openUser() {
    if (doc('logoutScreen').style.display == 'flex') {
        doc('logoutScreen').style.display = 'none';
    } else {
        doc('logoutScreen').style.display = 'flex';
    }
}

/**
 * Check Width Size for Responsiv
 *
 *  @param clientWidth - the size of the user screen
 *
 * */
async function widthSize() {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width <= 850) {
        subtitleMobile();
    } else {
        subtitle();
    }
}

/**
 * Set Responsiv as Header Title and Logo 
 * */
function subtitleMobile(){
    if (doc('subtitleHeader')) {
        doc('subtitleHeader').classList.remove('headerText');
        doc('subtitleHeader').classList.add('headerMobile');
        doc('subtitleHeader').innerHTML = '<img class="mobileLogo" src="./img/join_logo_dark.svg">';
    }
}

/**
 * Set Header Title 
 * */
function subtitle(){
    if (doc('subtitleHeader')) {
        doc('subtitleHeader').classList.remove('headerMobile');
        doc('subtitleHeader').classList.add('headerText');
        doc('subtitleHeader').innerHTML = 'Kanban Project Management Tool';
    }
}

/**
 * Event Listener for automate Width Size
 * 
 * This event listener triggers the function for widthSize and sends the string goToMobile 
 * 
 * */
window.addEventListener("resize", function () {
    widthSize();
});

/**
 * Not close Event 
 * 
 * This function prevents closing a popup when clicking on certain levels
 * 
*/
function notClose(event) {
    event.stopPropagation();
  }