const STORAGE_TOKEN = 'TJJS7PQGUMX72JU6UWW00YOS9BIWN99TFB2N438Q';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
let contacts = [];
let firstLetter = [];

function loadContacts() {
    if (loadCont('allContacts')) {
        contacts = loadCont('allContacts');
    }
    loadLetter();

    let contactLoad = document.getElementById('contactLoad');
    contactLoad.innerHTML = '';

    let loadFirstLetter = firstLetter.sort();

    for (let i = 0; i < loadFirstLetter.length; i++) {
        let contactLetterLoad = loadFirstLetter[i];
        contactLoad.innerHTML += /*html*/`
        <div class="letter">${contactLetterLoad}</div>
        <div class="line">
            <div class="lineBorder"></div>
        </div>
        <div id="contactShow${i}"></div>
        `;

        let contactShow = document.getElementById(`contactShow${i}`);

        for (let c = 0; c < contacts.length; c++) {
            let saveLetter = contacts[c]['name'].charAt(0);
            if (contactLetterLoad.includes(saveLetter)) {
                let contact = contacts[c];
                const nameParts = contact['name'].split(" ");
                const initials = nameParts.map(part => part.charAt(0)).join("");
                contactShow.innerHTML += /*html*/`
    <div class="list" id="cID${contact['id']}" onclick="showContact(${contact['id']})">
            <div class="circle" id="listCircle${contact['id']}">${initials}</div>
            <div class="contactNameList">
                <p class="listName">${contact['name']}</p>
                <p class="listEmail">${contact['email']}</p>
            </div>
        </div>
    `;
    let circle = document.getElementById(`listCircle${contact['id']}`);
    circle.classList.add(contact['color']);
            }
        }
    }
}

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

function loadNewContact(name, email, phone) {
    let nameShow = name;
    let emailShow = email;
    let phoneShow = phone;
    if (!name && !email && !phone) {
        nameShow = '';
        emailShow = '';
        phoneShow = '';
    }
    let formNewContact = document.getElementById('user');
    formNewContact.innerHTML = /*html*/`
        <img src="./img/clearcontackt.svg">
        <form action="#" onsubmit="createContact(); return false">
            <div class="input"><input type="text" id="name" value="${nameShow}" placeholder="Name" required><img src="./img/personContact.svg"></div>
            <div class="input"><input type="email" id="email" value="${emailShow}" placeholder="E-Mail" required><img src="./img/emailContact.svg"></div>
            <div class="input"><input type="text" id="phone" value="${phoneShow}" placeholder="Phone" required><img src="./img/phoneContact.svg"></div>
            <div class="popupButton">
                <div class="cancel" onclick="closePopup()">Cancel <img src="./img/addtask_icon_cancel_dark.svg"></div>
                <button type="submit">Create contact <img src="./img/addtask_icon_check.svg"></button>
            </div>
        </form>`;
}

function showContact(id) {
    let showContact = document.getElementById('showContact');
    let userId = document.getElementById(`cID${id}`);
    removeClassList();
    userId.classList.remove('list');
    userId.classList.add('listVisited');
    showContact.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contactData = contacts[i];
        if (contactData['id'] == id) {
                const nameParts = contactData['name'].split(" ");
                const initials = nameParts.map(part => part.charAt(0)).join("");
            console.log(contactData['name'].split(' ').length);
            showContact.innerHTML = /*html*/`
    <div class="cHeader">
        <div class="circle cwidth" id="circle${id}">${initials}</div>
        <div class="contactName">
            <p class="cName">${contactData['name']}</p>
            <div class="edit">
                <p onclick="notClose(event), editContact(1)"><img src="./img/edit.svg">Edit</p>
                <p><img src="./img/delete.svg">Delete</p>
            </div>
        </div>
    </div>
    <p>Contact Information</p>
    <div class="cInfo">
        <p>Email</p>
        <p class="email">${contactData['email']}</p>
        <p>Phone</p>
        <p class="phone">${contactData['phone']}</p>
    </div>
    `;
            let circle = document.getElementById(`circle${id}`);
            circle.classList.add(contactData['color']);
            userId.classList.remove('list');
            userId.classList.add('listVisited');
        }
    }
}

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

function createContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let color = getRndInteger(1, 9);
    let lastID = contacts.length;
    let idShow = lastID + 1
    contacts.push({ "id": idShow, "name": name.value, "email": email.value, "phone": phone.value, "color": color });
    let contactsLoad = JSON.stringify(contacts);
    localStorage.setItem('allContacts', contactsLoad);
    loadCont();
    loadContacts();
    showContact(idShow);
    closePopup();
    location.assign(`#cID${idShow}`);
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

function getRndInteger(min, max) {
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

function loadCont(key) {
    return JSON.parse(localStorage.getItem(key))
}

function loadLetter() {
    for (let i = 0; i < contacts.length; i++) {
        let contactsLoad = contacts[i]['name'];
        let saveLetter = contactsLoad.charAt(0);
        if (!firstLetter.includes(saveLetter)) {
            firstLetter.push(saveLetter);
        }
    }
}