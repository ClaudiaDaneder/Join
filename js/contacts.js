let contacts = [];
let firstLetter = [];
let contactsKey = 'allContacts';

async function init(id) {
    await includeHTML();
    await loadRemote();
    loadLetter();
    loadContacts();
    initOnline();
    await enableNavigation();
    await navigation('show');
    if(id){
        addClassList(id);
    }
}

/**
 * This function loads the individual initial letters and sorts them, then outputs them
 * 
 * @param sort - sort the letters into the correct order
 * 
 * */
function loadContacts() {
    doc('contactLoad').innerHTML = '';
    let loadFirstLetter = firstLetter.sort();

    for (let i = 0; i < loadFirstLetter.length; i++) {
        let contactLetterLoad = loadFirstLetter[i];
        doc('contactLoad').innerHTML += letterTemp(contactLetterLoad, i);
        loadNames(contactLetterLoad, i);
    }
}

/**
 * This function loads the names of the contacts according to the order of the initial letters
 * 
 * @param {string} contactLetterLoad - is passed by loadContacts to search for the contacts of the respective first letter
 * @param {number} i - is the location in the array
 * 
 * */
function loadNames(contactLetterLoad, i) {
    for (let c = 0; c < contacts.length; c++) {
        let saveLetter = contacts[c]['name'].charAt(0);
        if (contactLetterLoad.includes(saveLetter)) {
            let contact = contacts[c];
            let initials = initialsLoad(contact['name'])
            doc(`contactShow${i}`).innerHTML += contactListTemp(contact['id'], initials, contact['name'], contact['email']);
            loadCircle(contact['id'], contact['color'], 'listCircle');
        }
    }
}

/**
 * This function compares the entered email address and, if false, forwards it to the next function
 * */
async function createContact() {
    if (contactExist(doc('email').value) == false) {
        contactCreate();
        closePopup();
    } else {
        savePopup('exist');
    }

}

/**
 * This function creates the contact and forwards it to the SaveRemote function to then save it 
 * */
async function contactCreate() {
    let color = getColor(1, 9);
    let idShow = searchId();
    let dataContact = returnArray(idShow, doc('name'), doc('email'), doc('phone'), color);
    await saveRemote(dataContact);
    init();
    savePopup('create');
    slideContact(idShow);
}

/**
 * This function checks whether the user with the email already exists
 * 
 * @param {string} email - This string is the email address entered by the createContact function
 * @param find - This function looks for the email address in the contacts array and returns true or false
 * 
 * */
function contactExist(email) {
    if (contacts.find(user => user.email === email)) {
        return true;
    } else {
        return false;
    }
}

/**
 * This function creates a JSON array and returns it to the contactCreate function to then save it via saveRemote * 
 * */
function returnArray(idShow, name, email, phone, color) {
    return {
        "id": idShow,
        "name": name.value,
        "email": email.value,
        "phone": phone.value,
        "color": color,
        "online": false,
        "password": null
    };
}

/**
 * This function looks for the id in the last array and adds 1 to it to create the next id 
 * */
function searchId() {
    lastID = contacts[contacts.length - 1];
    if (lastID == null || lastID == '') {
        lastID = 0;
    } else {
        lastID = lastID['id'];
    }
    return lastID + 1;
}

/**
 * This function shows the popup for creating a new contact and adds the back arrow in responsive mode
 * */
function addContact() {
    doc('addContactPopup').style.transform = 'translateX(0)';
    doc('popupTitle').innerHTML = popupNames('add');
    loadNewContact();
    doc('back').classList.add('back');
}

/**
 * This function shows the popup for editing a new contact and adds the back arrow in responsive mode
 * 
 * @param {number} id - this is the id of the contact
 * 
 * */
function editContact(id) {
    doc('addContactPopup').style.transform = 'translateX(0)';
    doc('popupTitle').innerHTML = popupNames('edit');
    loadEditContact(id);
    doc('back').classList.add('back');
}

/**
 * This function looks for the contact's data and passes it on to loadNewContact
 * 
 * @param {number} id - this is the id of the contact
 * 
 * */
function loadEditContact(id) {
    for (let i = 0; i < contacts.length; i++) {
        let contactData = contacts[i];
        if (contactData['id'] == id) {
            loadNewContact(contactData['name'], contactData['email'], contactData['phone'], contactData['color'], id, i)
        }
    }
}

/**
 * This function reads the entered data and forwards it to storage
 * 
 * @param {number} id - this is the id of the contact
 * @param {number} i - is the location in the array
 *  
 * */
async function saveContact(i, id) {
    contacts[i]['name'] = doc('name').value;
    contacts[i]['email'] = doc('email').value;
    contacts[i]['phone'] = doc('phone').value;
    await setItem(`${contactsKey}`, JSON.stringify(contacts));
    showContact(id);
    init(id);
    savePopup('edit');
    closePopup();
}

/**
 * This function deletes a contact
 * 
 * @param {number} id - this is the id of the contact
 * 
 * */
async function deleteContact(id) {
    if(checkOnlineUser(id) == true){
        contacts.splice(id, 1);
        await setItem(`${contactsKey}`, JSON.stringify(contacts));
        firstLetter = [];
        doc('showContact').innerHTML = '';
        init();
        savePopup('delete');
        checkBackSlide();
    }else{
        savePopup('denied');
    }
}

function checkOnlineUser(contactsID){
    if(contacts[contactsID]['password'] == null || contacts[contactsID]['email'] == yourId) return true;
}
/**
 * This function looks for the data of the contact that is being edited and passes it on
 * 
 * @param {string} name - that is the name of the contact
 * @param {string} email - that is the email of the contact
 * @param {string} phone - that is the phonenumber of the contact
 * @param {string} color - that is the color of the contact
 * @param {number} id - this is the id of the contact
 * @param {number} i - is the location in the array
 * 
 * */
async function loadNewContact(name, email, phone, color, id, i) {
    let nameShow = await searchData(name);
    let emailShow = await searchData(email);
    let phoneShow = await searchData(phone);
    let buttonShow = button(name);
    let colorShow = await searchData(color);
    doc('user').innerHTML = popupTempForm(nameShow, emailShow, phoneShow, buttonShow, colorShow, id);
    await buttenCreate(buttonShow, doc('createEdit'), i, id);
    loadCircle(id, color, 'circleEdit');
}

/**
 * This function returns either the value or an empty field if there is no data in it
 * 
 * @param {string} data - This is the data set passed by the loadNewContact function
 * 
 * */
function searchData(data) {
    if (!data || data == undefined) {
        return '';
    } else {
        return data;
    }
}

/**
 * This function generates the name of the button in the popup 
 * 
 * @param {string} data - This is the data set passed by the loadNewContact function
 * 
 * */
function button(data) {
    if (!data) {
        return 'Create';
    } else {
        return 'Save';
    }
}

/**
 * This function creates the button with its attributes 
 * 
 * @param {string} buttonShow - This is the value transmitted to make a comparison
 * @param {string} createEdit - this is the determined value of the element
 * @param {number} id - this is the id of the contact
 * @param {number} i - is the location in the array 
 * 
 * */
async function buttenCreate(buttonShow, createEdit, i, id) {
    if (buttonShow == 'Save') {
        createEdit.setAttribute('onsubmit', `saveContact(${i}, ${id}); return false`);
    } else {
        createEdit.setAttribute('onsubmit', 'createContact(); return false');
    }
}

/**
 * This function looks for the contact with his complete data and forwards this to the template function loadContactShow
 * 
 * @param {number} id - this is the id of the contact
 * @param location.assign - changes the url
 * 
 * */
async function showContact(id) {
    removeClassList();
    addClassList(id);
    location.assign(`#cID${id}`);
    doc('showContact').innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contactData = contacts[i];
        if (contactData['id'] == id) {
            let initials = initialsLoad(contactData['name']);
            doc('showContact').innerHTML = loadContactShow(id, initials, contactData['name'], contactData['email'], contactData['phone'], i);
            loadCircle(id, contactData['color'], 'circle');
        }
    }
}

/**
 * This function creates the initials of the contact's name 
 * 
 * @param {string} name - is the name passed
 * @param split - splits the first name into two strings
 * @param map - iterates over each element in the nameParts array
 * @param charAt(0) - gibt den ersten Buchstaben des jeweiligen Namens zurück
 * @param join - puts all the letters together
 * 
 * */
function initialsLoad(name) {
    const nameParts = name.split(" ");
    return initials = nameParts.map(part => part.charAt(0)).join("");
}

/**
 * This function adds the respective color to the element
 * The strings passed must not be empty
 * 
 * @param {number} id - this is the id of the contact
 * @param {string} color - that is the color of the contact
 * @param {string} circleName - This is the name of the element, followed immediately by the ID of the contact
 *   
 * */
function loadCircle(id, color, circleName) {
    if (id != null && color != null && circleName != null) {
        doc(`${circleName}${id}`).classList.add(color);
    }
}

/**
 * This function removes its class from the clicked contact in the list and adds the visited class
 * 
 * @param {number} id - this is the id of the contact
 * 
 * */
function addClassList(id) {
    if (doc(`cID${id}`) || location.assign(`#cID${id}`)) {
        doc(`cID${id}`).classList.remove('list');
        doc(`cID${id}`).classList.add('listVisited');
    }
}

/**
 * This function searches for the class list Visited and removes its class from all contacts that have this class and adds the list class
 * */
function removeClassList() {
    for (let i = 0; i < contacts.length; i++) {
        let id = contacts[i]['id'];
        doc(`cID${id}`)
        if (doc(`cID${id}`)) {
            if (doc(`cID${id}`).className === 'listVisited') {
                doc(`cID${id}`).classList.remove('listVisited');
                doc(`cID${id}`).classList.add('list');
            }
        }
    }
}

/**
 * This function outputs a random number from 1 - 9 
 * (in this case the min value 1 and max value 9 are passed from the contactCreate function) to the searchColor function
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
 * This function loads the first letter from the name and pushes them into an array 
 * */
function loadLetter() {
    for (let i = 0; i < contacts.length; i++) {
        let contactsName = contacts[i]['name'];
        if (contactsName) {
            let saveLetter = contactsName.charAt(0);
            if (!firstLetter.includes(saveLetter)) {
                firstLetter.push(saveLetter);
            }
        }
    }
}

/**
 * This function first puts the data into an array and then passes it on to the remote function to save it
 * 
 * @param {array} user - this is the contact as a json array
 * */
async function saveRemote(user) {
    contacts.push(user);
    await setItem(`${contactsKey}`, JSON.stringify(contacts));
}

/**
 * This function loads all contacts from the remote storage function 
 * 
 * @param {array} Array.isArray - This function checks whether the output array is really an array
 * @param filter - Ensures that each user in 'users' has a valid 'name' attribute
 * 
 * */
async function loadRemote() {
    let users = JSON.parse(await getItem(`${contactsKey}`));
    if (Array.isArray(users)) {
        contacts = users.filter(user => user && user['name']);
    }
}