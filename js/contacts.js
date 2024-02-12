let contacts = [];
let firstLetter = [];
let contactsKey = 'allContacts';

async function init() {
    await loadRemote();
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
    await setItem(contactsKey, JSON.stringify(contacts));
    showContact(id);
    init();
    savePopup('edit');
    closePopup();
}

/**Delete Contact*/
async function deleteContact(id) {
    contacts.splice(id, 1);
    await setItem(contactsKey, JSON.stringify(contacts));
    firstLetter = [];
    let showContact = document.getElementById('showContact');
    showContact.innerHTML = '';
    init();
    savePopup('delete');
}

/**Show Popup Form*/
function loadNewContact(name, email, phone, color, id, i) {
    let formNewContact = document.getElementById('user');
    let nameShow = name;
    let emailShow = email;
    let phoneShow = phone;
    let colorShow = color;
    let array = i;
    let button = 'Save';
    if (!name && !email && !phone && i == undefined) {
        nameShow = '';
        emailShow = '';
        phoneShow = '';
        colorShow = '';
        array = '';
        button = 'Create';
    }
    formNewContact.innerHTML = popupTempForm(nameShow, emailShow, phoneShow, button, colorShow, id, array);
    loadCircle(id, color, 'circleEdit');
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

/**Create and Save the New Contact */
async function createContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let color = getColor(1, 9);
    let idShow = searchId();
    let dataContact = {
        "id": idShow, "name": name.value, "email": email.value, "phone": phone.value, "color": color
    }
    await saveRemote(dataContact);
    init();
    savePopup('create');
    slideContact(idShow);
    closePopup();
}

/**Search ID */
function searchId(){
    lastID = contacts.length;
    if(lastID == null || lastID == ''){
        lastID = 0;
    }
    return lastID + 1;
}

/**Save Remote Storage */
async function saveRemote(user){
    contacts.push(user);
    await setItem(contactsKey, JSON.stringify(contacts));
}

/**Load Remote Storage */
async function loadRemote(){
    let users = JSON.parse(await getItem(contactsKey));
    if (Array.isArray(users)) {
        // Stellen Sie sicher, dass jeder Benutzer in 'users' ein gültiges 'name'-Attribut hat
        contacts = users.filter(user => user && user['name']);
    }
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