/**
 * Create Popup Template for Create and Edit Contact 
 * */
function popupTempForm(nameShow, emailShow, phoneShow, button, color, id) {
  let ini = initialsLoad(nameShow);
  let img = /*html*/`<div class="circleEdit" id="circleEdit${id}">${ini}</div>`;
  if (!color) {
    img = '<img class="clearContact" src="./img/clearcontackt.svg">';
  }
  return /*html*/`
          ${img}
          <form action="#" id="createEdit" onsubmit="createContact(); return false">
              <div class="input"><input type="text" id="name" value="${nameShow}" placeholder="Name" required><img src="./img/personContact.svg"></div>
              <div class="input"><input type="email" id="email" value="${emailShow}" placeholder="E-Mail" required><img src="./img/emailContact.svg"></div>
              <div class="input"><input type="number" id="phone" value="${phoneShow}" placeholder="Phone" required><img src="./img/phoneContact.svg"></div>
              <div class="popupButton">
                  <div class="cancel" onclick="closePopup()">Cancel <img src="./img/addtask_icon_cancel_dark.svg"></div>
                  <button type="submit">${button} contact <img src="./img/addtask_icon_check.svg"></button>
              </div>
          </form>`;
}

/**
 * Load Contact Data of Show Contacts 
 * */
function loadContactShow(id, initials, name, email, phone, i) {
  doc('mobileEdit').setAttribute('onclick', `notClose(event), editContact(${id})`);
  doc('mobileDelete').setAttribute('onclick', `deleteContact(${i})`);
  return /*html*/`
    <div class="cHeader">
        <div class="circle cwidth" id="circle${id}">${initials}</div>
        <div class="contactName">
            <p class="cName">${name}</p>
            <div class="edit">
                <p onclick="notClose(event), editContact(${id}, ${i})"><img src="./img/edit.svg">Edit</p>
                <p onclick="deleteContact(${i})"><img src="./img/delete.svg">Delete</p>
            </div>
        </div>
    </div>
    <p class="contactsInfo">Contact Information</p>
    <div class="cInfo">
        <p>Email</p>
        <p class="email">${email}</p>
        <p>Phone</p>
        <p class="phone">${phone}</p>
    </div>
    `
}

/**
 * Letter Template 
 * */
function letterTemp(contactLetterLoad, i) {
  return /*html*/`
          <div class="letter">${contactLetterLoad}</div>
          <div class="line">
              <div class="lineBorder"></div>
          </div>
          <div id="contactShow${i}"></div>
          `;
}

/**
 * Contactlist Template 
 * */
function contactListTemp(id, initials, name, email) {
  return /*html*/`
    <div class="list" id="cID${id}" onclick="slideContact(${id})">
            <div class="circle" id="listCircle${id}">${initials}</div>
            <div class="contactNameList">
                <p class="listName">${name}</p>
                <p class="listEmail">${email}</p>
            </div>
        </div>
    `;
}

/**
 * Slidefunction for Show Contacts 
 * */
function slideContact(id) {
  if (widthContactSize() == false) {
    noResponsiv(id);
  } else {
    slideResponsiv(id);
  }
}

/**
 * Slide no Responsiv 
 * */
function noResponsiv(id) {
  if (doc('showContact').style.transform == 'translatex(150vw)') {
    doc('showContact').style.transform = 'translatex(0)';
    showContact(id);
  } else {
    doc('showContact').style.transform = 'translatex(150vw)';
    setTimeout(() => {
      doc('showContact').style.transform = 'translatex(0)';
      showContact(id);
    }, 250);
  }
}

/**
 * Slide Responsiv 
 * */
function slideResponsiv(id) {
  if (doc('showContactsView').style.transform != 'translatex(0px)') {
    doc('listAllContacts').style.transform = 'translatex(-100vw)';
    doc('showContactsView').style.transform = 'translatex(0)';
    setTimeout(() => {
      doc('menueContacts').style.display = 'flex';
    }, 150);
    showContact(id);
  }
}

/**
 * Back to Contactlist in Responsiv mode 
 * */
function backToContacts() {
  doc('listAllContacts').style.transform = 'translatex(0)';
  doc('showContactsView').style.transform = 'translatex(100vw)';
  setTimeout(() => {
    doc('menueContacts').style.display = 'none';
  }, 150);
  doc('showContact').innerHTML = '';
  init();
  location.assign('#');
}

/**
 * Responsiv Slide Back to Contactlist after delete 
 * */
function checkBackSlide() {
  if (widthContactSize() == true) {
    backToContacts();
  }
}

/**
 * Menu for Responsiv mode in Show Contacts 
 * */
function openMenue() {
  if (doc('menuePopup').style.transform != 'translateX(0px)') {
    doc('menuePopup').style.transform = 'translatex(0)';
  } else {
    doc('menuePopup').style.transform = 'translatex(100vw)';
  }
}

/**
 * Width function for Contacts 
 * */
function widthContactSize() {
  let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (width <= 850) {
    return true;
  } else {
    return false;
  }
}

/**
 * EventListener for Responsiv 
 * */
window.addEventListener("resize", function () {
  let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (width <= 850) {
    if (doc('listAllContacts').style.transform != 'translatex(0px)') {
      doc('listAllContacts').style.transform = 'translatex(0)';
      doc('showContactsView').style.transform = 'translatex(100vw)';
      if(location.assign('#')){
        backToContacts();
      }
    }
  } else {
    doc('listAllContacts').style.transform = 'unset';
    doc('showContactsView').style.transform = 'unset';
  }
});

/**
 * Popup function for show Info Popup 
 * */
function savePopup(saveInfo) {
  doc('save_info').innerHTML = 'Contact succesfully created'
  if (saveInfo == 'edit') {
    doc('save_info').innerHTML = 'Contact succesfully saved';
  } else if (saveInfo == 'delete') {
    doc('save_info').innerHTML = 'Contact deleted';
  } else if (saveInfo == 'exist') {
    doc('save_info').innerHTML = 'Contact Email Exist';
  } else if('denied'){
    doc('save_info').innerHTML = 'Access Denied';
  }
  doc('save_info').style.transform = 'translatex(0)';
  setTimeout(() => {
    doc('save_info').style.transform = 'translatex(150vw)';
  }, 1500);
}

/**
 * Popup Title 
 * */
function popupNames(contactAdd) {
  if (contactAdd == 'add') {
    return /*html*/`
        <p class="popupTop">Add contact</p>
        <p class="popupBottom">Tasks are better with a team!</p>
        <div class="popupBottomLine"></div>
    `;
  } else {
    return /*html*/`
        <p class="popupTop">Edit contact</p>
        <div class="popupBottomLine"></div>
    `;
  }
}

/**
 * Closing Popup for Create or Edit Contact 
 * */
function closePopup() {
  doc('logoutScreen').style.display = 'none';
  if (doc('addContactPopup').style.transform == 'translateX(0px)') {
    doc('addContactPopup').style.transform = 'translateX(150vw)';
  }
  if (doc('menuePopup')) {
    doc('menuePopup').style.transform = 'translatex(100vw)';
  }
  doc('user').innerHTML = '';
  doc('popupTitle').innerHTML = '';
  doc('back').classList.remove('back');
}

/**
 * Not Closing event for Popup with onclick function 
 * */
function notClose(event) {
  event.stopPropagation();
}