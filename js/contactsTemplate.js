/*Contacts Templates*/

function popupTempForm(nameShow, emailShow, phoneShow, button, color, id, i) {
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
  
  function loadContactShow(id, initials, name, email, phone, i) {
    let mobileEdit = document.getElementById('mobileEdit');
    let mobileDelete = document.getElementById('mobileDelete');
    mobileEdit.setAttribute('onclick', `notClose(event), editContact(${id})`);
    mobileDelete.setAttribute('onclick', `deleteContact(${i})`);
    return /*html*/`
    <div class="cHeader">
        <div class="circle cwidth" id="circle${id}">${initials}</div>
        <div class="contactName">
            <p class="cName">${name}</p>
            <div class="edit">
                <p onclick="notClose(event), editContact(${id})"><img src="./img/edit.svg">Edit</p>
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
  
  function letterTemp(contactLetterLoad, i) {
    return /*html*/`
          <div class="letter">${contactLetterLoad}</div>
          <div class="line">
              <div class="lineBorder"></div>
          </div>
          <div id="contactShow${i}"></div>
          `;
  }
  
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
  
  function slideContact(id) {
    let divContacts = document.getElementById('showContact');
    let sidecontacts = document.getElementById('listAllContacts');
    let showContactsView = document.getElementById('showContactsView');
    let menueContacts = document.getElementById('menueContacts');
    if (widthContactSize() == false) {
      if (divContacts.style.transform == 'translatex(150vw)') {
        divContacts.style.transform = 'translatex(0)';
        showContact(id);
      } else {
        divContacts.style.transform = 'translatex(150vw)';
        setTimeout(() => {
          divContacts.style.transform = 'translatex(0)';
          showContact(id);
        }, 250);
      }
    } else {
      if (showContactsView.style.transform != 'translatex(0px)') {
        sidecontacts.style.transform = 'translatex(-100vw)';
        showContactsView.style.transform = 'translatex(0)';
        setTimeout(() => {
          menueContacts.style.display = 'flex';
        }, 150);
        showContact(id);
      }
    }
  }
  
  function backToContacts() {
    let sidecontacts = document.getElementById('listAllContacts');
    let showContactsView = document.getElementById('showContactsView');
    let menueContacts = document.getElementById('menueContacts');
    let showContact = document.getElementById('showContact');
    sidecontacts.style.transform = 'translatex(0)';
    showContactsView.style.transform = 'translatex(100vw)';
    setTimeout(() => {
      menueContacts.style.display = 'none';
    }, 150);
    showContact.innerHTML = '';
    init();
    location.assign('#');
  }
  
  function openMenue() {
    let menuePopup = document.getElementById('menuePopup');
    if (menuePopup.style.transform != 'translateX(0px)') {
      menuePopup.style.transform = 'translatex(0)';
    } else {
      menuePopup.style.transform = 'translatex(100vw)';
    }
  }
  
  function widthContactSize() {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width <= 850) {
      return true;
    } else {
      return false;
    }
  }
  
  window.addEventListener("resize", function () {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let sidecontacts = document.getElementById('listAllContacts');
    let showContactsView = document.getElementById('showContactsView');
    if (width <= 850) {
      if (sidecontacts.style.transform != 'translatex(0px)') {
        sidecontacts.style.transform = 'translatex(0)';
        showContactsView.style.transform = 'translatex(100vw)';
        backToContacts();
      }
    } else {
      sidecontacts.style.transform = 'unset';
      showContactsView.style.transform = 'unset';
    }
  });
  
  function savePopup(saveInfo) {
    let savePopup = document.getElementById('save_info');
    savePopup.innerHTML = 'Contact succesfully created'
    if (saveInfo == 'edit') {
      savePopup.innerHTML = 'Contact succesfully saved';
    } else if (saveInfo == 'delete') {
      savePopup.innerHTML = 'Contact deleted';
    } else if (saveInfo == 'exist') {
      savePopup.innerHTML = 'Contact Email Exist';
    }
    savePopup.style.transform = 'translatex(0)';
    setTimeout(() => {
      savePopup.style.transform = 'translatex(150vw)';
    }, 1500);
  }
  
  
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
  
  /**Closing Popup for Create or Edit Contact */
  function closePopup() {
    let addContact = document.getElementById('addContactPopup');
    let back = document.getElementById('back');
    let formNewContact = document.getElementById('user');
    let popupTitle = document.getElementById('popupTitle');
    let open = document.getElementById('logoutScreen');
    let openMenue = document.getElementById('menuePopup');
    open.style.display = 'none';
    if (addContact.style.transform == 'translateX(0px)') {
      addContact.style.transform = 'translateX(150vw)';
    }
    if (openMenue) {
      openMenue.style.transform = 'translatex(100vw)';
    }
    formNewContact.innerHTML = '';
    popupTitle.innerHTML = '';
    back.classList.remove('back');
  }
  
  /**Not Closing event for Popup with onclick function */
  function notClose(event) {
    event.stopPropagation();
  }
  
  /*Contacts Templates*/