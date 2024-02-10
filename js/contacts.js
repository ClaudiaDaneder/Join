const STORAGE_TOKEN = 'TJJS7PQGUMX72JU6UWW00YOS9BIWN99TFB2N438Q';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
let contacts = [];
let firstLetter = [];

function init(){
    if (loadCont('allContacts')) {
        contacts = loadCont('allContacts');
    }
    loadLetter();
    loadContacts();
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
function loadNames(contactLetterLoad, i){
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

/**Add Contact Popup*/
function addContact() {
    let addContact = document.getElementById('addContactPopup');
    let popupTitle = document.getElementById('popupTitle');
    let back = document.getElementById('back');
    addContact.style.transform = 'translateX(0)';
    popupTitle.innerHTML = /*html*/`
        <p class="popupTop">Add contact</p>
        <p class="popupBottom">Tasks are better with a team!</p>
        <div class="popupBottomLine"></div>
    `;
    loadNewContact();
    back.classList.add('back');
}

/**Edit Contact Popup*/
function editContact(id) {
    let addContact = document.getElementById('addContactPopup');
    let popupTitle = document.getElementById('popupTitle');
    let back = document.getElementById('back');
    addContact.style.transform = 'translateX(0)';
    popupTitle.innerHTML = /*html*/`
        <p class="popupTop">Edit contact</p>
        <div class="popupBottomLine"></div>
    `;
    loadNewContact('Alexander Fischer', 'alexfischer@gmail.com', '017564582069');
    back.classList.add('back');
}

/**Show Popup Form*/
function loadNewContact(name, email, phone) {
    let formNewContact = document.getElementById('user');
    let nameShow = name;
    let emailShow = email;
    let phoneShow = phone;
    let button = 'Save';
    if (!name && !email && !phone) {
        nameShow = '';
        emailShow = '';
        phoneShow = '';
        button = 'Create';
    }
    formNewContact.innerHTML = popupTempForm(nameShow, emailShow, phoneShow, button);
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
            showContact.innerHTML = loadContactShow(id, initials, contactData['name'], contactData['email'], contactData['phone']);
            loadCircle(id, contactData['color'], 'circle');
        }
    }
}

/**Create the initals of Name  */
function initialsLoad(name){
    const nameParts = name.split(" ");
    return initials = nameParts.map(part => part.charAt(0)).join("");
}

/**Give Circle with initals the color  */
function loadCircle(id, color, circleName){
    let circle = document.getElementById(`${circleName}${id}`);
    circle.classList.add(color);
}

/**add Classlist in Contactlist  */
function addClassList(id){
    let userId = document.getElementById(`cID${id}`);
    userId.classList.remove('list');
    userId.classList.add('listVisited');
}

/**Remove Classlist of all Contacts in Contactlist  */
function removeClassList() {
    for (let i = 0; i < contacts.length; i++) {
        let id = contacts[i]['id'];
        let userId = document.getElementById(`cID${id}`);
        if (userId.className == 'listVisited') {
            userId.classList.remove('listVisited');
            userId.classList.add('list');
        }
    }
}

/**Create and Save the New Contact */
function createContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let color = getColor(1, 9);
    let lastID = contacts.length;
    let idShow = lastID + 1
    contacts.push({ "id": idShow, "name": name.value, "email": email.value, "phone": phone.value, "color": color });
    let contactsLoad = JSON.stringify(contacts);
    localStorage.setItem('allContacts', contactsLoad);
    init();
    showContact(idShow);
    closePopup();
}

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**Closing Popup for Create or Edit Contact */
function closePopup() {
    let addContact = document.getElementById('addContactPopup');
    let back = document.getElementById('back');
    let formNewContact = document.getElementById('user');
    let popupTitle = document.getElementById('popupTitle');
    if (addContact.style.transform == 'translateX(0px)') {
        addContact.style.transform = 'translateX(150vw)';
    }
    formNewContact.innerHTML = '';
    popupTitle.innerHTML = '';
    back.classList.remove('back');
}

/**Not Closing event for Popup with onclick function */
function notClose(event) {
    event.stopPropagation();
}

/**Random Color */
function getColor(min, max) {
    color = Math.floor(Math.random() * (max - min + 1)) + min;
    let number = '';
    if (color == 1) { number = 'darkorange'; } else
    if (color == 2) { number = 'orange'; } else
    if (color == 3) { number = 'lightorange'; } else
    if (color == 4) { number = 'pink'; } else
    if (color == 5) { number = 'lightpink'; } else
    if (color == 6) { number = 'lightpurple'; } else
    if (color == 7) { number = 'purple'; } else
    if (color == 8) { number = 'blue'; } else
    if (color == 9) { number = 'cyan'; }
    return number;
}

/**Load Contacts as JSON Array */

function loadCont(key) {
    return JSON.parse(localStorage.getItem(key))
}

/**Load First Letter of Name and Push this in a Array */
function loadLetter() {
    for (let i = 0; i < contacts.length; i++) {
        let contactsLoad = contacts[i]['name'];
        let saveLetter = contactsLoad.charAt(0);
        if (!firstLetter.includes(saveLetter)) {
            firstLetter.push(saveLetter);
        }
    }
}