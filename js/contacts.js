let contacts = [];
let firstLetter = [];
let contactsKey = 'allContacts';

async function init() {
    await includeHTML();
    await loadRemote();
    loadLetter();
    loadContacts();
    initOnline();
    await enableNavigation();
    await navigation('show');
}

/**Load Letters of the Contactlist*/
function loadContacts() {
    let contactLoad = document.getElementById('contactLoad');
    contactLoad.innerHTML = '';
    let loadFirstLetter = firstLetter.sort();

    for (let i = 0; i < loadFirstLetter.length; i++) {
        let contactLetterLoad = loadFirstLetter[i];
        contactLoad.innerHTML += letterTemp(contactLetterLoad, i);
        loadNames(contactLetterLoad, i);
    }
}

/**Load Names of the Contactlist*/
function loadNames(contactLetterLoad, i) {
    let contactShow = document.getElementById(`contactShow${i}`);
    for (let c = 0; c < contacts.length; c++) {
        let saveLetter = contacts[c]['name'].charAt(0);
        if (contactLetterLoad.includes(saveLetter)) {
            let contact = contacts[c];
            let initials = initialsLoad(contact['name'])
            contactShow.innerHTML += contactListTemp(contact['id'], initials, contact['name'], contact['email']);
            loadCircle(contact['id'], contact['color'], 'listCircle');
        }
    }
}

/**Create and Save the New Contact */
async function createContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    if (contactExist(email.value) == false) {
        contactCreate();
    } else {
        savePopup('exist');
    }

}


/**Finaly Create Contact */
async function contactCreate() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let color = getColor(1, 9);
    let idShow = searchId();
    let dataContact = returnArray(idShow, name, email, phone, color);
    await saveRemote(dataContact);
    init();
    savePopup('create');
    slideContact(idShow);
    closePopup();
}

/**Check Contact Exist */
function contactExist(email) {
    if (contacts.find(user => user.email === email)) {
        return true;
    } else {
        return false;
    }
}

/**Return a Array for Create Contact */
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

/**Search ID */

function searchId() {
    lastID = contacts[contacts.length-1];
    if (lastID == null || lastID == ''){
        lastID = 0;
    }else{
        lastID = lastID['id'];
    }
    return lastID + 1;
}

/**Add Contact Popup*/
function addContact() {
    let addContact = document.getElementById('addContactPopup');
    let popupTitle = document.getElementById('popupTitle');
    let back = document.getElementById('back');
    addContact.style.transform = 'translateX(0)';
    popupTitle.innerHTML = popupNames('add');
    loadNewContact();
    back.classList.add('back');
}

/**Edit Contact Popup*/
function editContact(id) {
    let addContact = document.getElementById('addContactPopup');
    let popupTitle = document.getElementById('popupTitle');
    let back = document.getElementById('back');
    addContact.style.transform = 'translateX(0)';
    popupTitle.innerHTML = popupNames('edit');
    loadEditContact(id);
    back.classList.add('back');
}

/**Edit Search Data*/
function loadEditContact(id) {
    for (let i = 0; i < contacts.length; i++) {
        let contactData = contacts[i];
        if (contactData['id'] == id) {
            loadNewContact(contactData['name'], contactData['email'], contactData['phone'], contactData['color'], id, i)
        }
    }
}

/**Edit Save Data */
async function saveContact(i, id) {
    let nameEdit = document.getElementById('name').value;
    let emailEdit = document.getElementById('email').value;
    let phoneEdit = document.getElementById('phone').value;
    contacts[i]['name'] = nameEdit;
    contacts[i]['email'] = emailEdit;
    contacts[i]['phone'] = phoneEdit;
    await setItem(`${contactsKey}`, JSON.stringify(contacts));
    showContact(id);
    init();
    savePopup('edit');
    closePopup();
}

/**Delete Contact*/
async function deleteContact(id) {
    contacts.splice(id, 1);
    await setItem(`${contactsKey}`, JSON.stringify(contacts));
    firstLetter = [];
    let showContact = document.getElementById('showContact');
    showContact.innerHTML = '';
    init();
    savePopup('delete');
}

/**Show Popup Form*/
async function loadNewContact(name, email, phone, color, id, i) {
    let formNewContact = document.getElementById('user');
    let nameShow = await searchData(name);
    let emailShow = await searchData(email);
    let phoneShow = await searchData(phone);
    let buttonShow = button(name);
    let colorShow = await searchData(color);
    let array = await searchData(i);
    formNewContact.innerHTML = popupTempForm(nameShow, emailShow, phoneShow, buttonShow, colorShow, id, array);
    let createEdit = document.getElementById('createEdit');
    if (buttonShow == 'Save') {
        createEdit.setAttribute('onsubmit', `saveContact(${i}, ${id}); return false`);
    } else {
        createEdit.setAttribute('onsubmit', 'createContact(); return false');
    }
    loadCircle(id, color, 'circleEdit');
}

function searchData(data) {
    if (!data || data == undefined) {
        return '';
    } else {
        return data;
    }
}

function button(data) {
    if (!data) {
        return 'Create';
    } else {
        return 'Save';
    }
}

/**Shows the selected contact   */
function showContact(id) {
    let showContact = document.getElementById('showContact');
    removeClassList();
    addClassList(id);
    location.assign(`#cID${id}`);
    showContact.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contactData = contacts[i];
        if (contactData['id'] == id) {
            let initials = initialsLoad(contactData['name']);
            showContact.innerHTML = loadContactShow(id, initials, contactData['name'], contactData['email'], contactData['phone'], i);
            loadCircle(id, contactData['color'], 'circle');
        }
    }
}

/**Create the initals of Name  */
function initialsLoad(name) {
    const nameParts = name.split(" ");
    return initials = nameParts.map(part => part.charAt(0)).join("");
}

/**Give Circle with initals the color  */
function loadCircle(id, color, circleName) {
    if (id != null && color != null && circleName != null) {
        let circle = document.getElementById(`${circleName}${id}`);
        circle.classList.add(color);
    }
}

/**add Classlist in Contactlist  */
function addClassList(id) {
    let userId = document.getElementById(`cID${id}`);
    userId.classList.remove('list');
    userId.classList.add('listVisited');
}

/**Remove Classlist of all Contacts in Contactlist  */
function removeClassList() {
    for (let i = 0; i < contacts.length; i++) {
        let id = contacts[i]['id'];
        let userId = document.getElementById(`cID${id}`);
        if (userId.className === 'listVisited') {
            userId.classList.remove('listVisited');
            userId.classList.add('list');
        }
    }
}

/**Save Remote Storage */
async function saveRemote(user) {
    contacts.push(user);
    await setItem(`${contactsKey}`, JSON.stringify(contacts));
}

/**Load Remote Storage */
async function loadRemote() {
    let users = JSON.parse(await getItem(`${contactsKey}`));
    if (Array.isArray(users)) {
        // Stellen Sie sicher, dass jeder Benutzer in 'users' ein gültiges 'name'-Attribut hat
        contacts = users.filter(user => user && user['name']);
    }
}

/**Random Color */
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

/**Load First Letter of Name and Push this in a Array */
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