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
    doc('contactLoad').innerHTML = '';
    let loadFirstLetter = firstLetter.sort();

    for (let i = 0; i < loadFirstLetter.length; i++) {
        let contactLetterLoad = loadFirstLetter[i];
        doc('contactLoad').innerHTML += letterTemp(contactLetterLoad, i);
        loadNames(contactLetterLoad, i);
    }
}

/**Load Names of the Contactlist*/
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

/**Create and Save the New Contact */
async function createContact() {
    if (contactExist(doc('email').value) == false) {
        contactCreate();
        closePopup();
    } else {
        savePopup('exist');
    }

}

/**Finaly Create Contact */
async function contactCreate() {
    let color = getColor(1, 9);
    let idShow = searchId();
    let dataContact = returnArray(idShow, doc('name'), doc('email'), doc('phone'), color);
    await saveRemote(dataContact);
    init();
    savePopup('create');
    slideContact(idShow);
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
    lastID = contacts[contacts.length - 1];
    if (lastID == null || lastID == '') {
        lastID = 0;
    } else {
        lastID = lastID['id'];
    }
    return lastID + 1;
}

/**Add Contact Popup*/
function addContact() {
    doc('addContactPopup').style.transform = 'translateX(0)';
    doc('popupTitle').innerHTML = popupNames('add');
    loadNewContact();
    doc('back').classList.add('back');
}

/**Edit Contact Popup*/
function editContact(id) {
    doc('addContactPopup').style.transform = 'translateX(0)';
    doc('popupTitle').innerHTML = popupNames('edit');
    loadEditContact(id);
    doc('back').classList.add('back');
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
    contacts[i]['name'] = doc('name').value;
    contacts[i]['email'] = doc('email').value;
    contacts[i]['phone'] = doc('phone').value;
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
    doc('showContact').innerHTML = '';
    init();
    savePopup('delete');
    checkBackSlide();
}

/**Show Popup Form*/
async function loadNewContact(name, email, phone, color, id, i) {
    let nameShow = await searchData(name);
    let emailShow = await searchData(email);
    let phoneShow = await searchData(phone);
    let buttonShow = button(name);
    let colorShow = await searchData(color);
    let array = await searchData(i);
    doc('user').innerHTML = popupTempForm(nameShow, emailShow, phoneShow, buttonShow, colorShow, id, array);    
    await buttenCreate(buttonShow, doc('createEdit'), i, id);
    loadCircle(id, color, 'circleEdit');
}

/**search Contact Data */
function searchData(data) {
    if (!data || data == undefined) {
        return '';
    } else {
        return data;
    }
}

/**Name of Button */
function button(data) {
    if (!data) {
        return 'Create';
    } else {
        return 'Save';
    }
}

/**Create Button */
async function buttenCreate(buttonShow, createEdit, i, id) {
    if (buttonShow == 'Save') {
        createEdit.setAttribute('onsubmit', `saveContact(${i}, ${id}); return false`);
    } else {
        createEdit.setAttribute('onsubmit', 'createContact(); return false');
    }
}

/**Shows the selected contact   */
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

/**Create the initals of Name  */
function initialsLoad(name) {
    const nameParts = name.split(" ");
    return initials = nameParts.map(part => part.charAt(0)).join("");
}

/**Give Circle with initals the color  */
function loadCircle(id, color, circleName) {
    if (id != null && color != null && circleName != null) {        
        doc(`${circleName}${id}`).classList.add(color);
    }
}

/**add Classlist in Contactlist  */
function addClassList(id) {
    if (doc(`cID${id}`)) {
        doc(`cID${id}`).classList.remove('list');
        doc(`cID${id}`).classList.add('listVisited');
    }
}

/**Remove Classlist of all Contacts in Contactlist  */
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