async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html"
      let resp = await fetch(file);
      if (resp.ok) {
          element.innerHTML = await resp.text();
      } else {
          element.innerHTML = 'Page not found';
      }
  }
}

/*Contacts Templates*/

function popupTempForm(nameShow, emailShow, phoneShow, button, color, id, i){
  let ini = initialsLoad(nameShow);
  let img = /*html*/`<div class="circleEdit" id="circleEdit${id}">${ini}</div>`;
  if(!color){
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

function loadContactShow(id, initials, name, email, phone, i){
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
  <p>Contact Information</p>
  <div class="cInfo">
      <p>Email</p>
      <p class="email">${email}</p>
      <p>Phone</p>
      <p class="phone">${phone}</p>
  </div>
  `
}

function letterTemp(contactLetterLoad, i){
  return /*html*/`
        <div class="letter">${contactLetterLoad}</div>
        <div class="line">
            <div class="lineBorder"></div>
        </div>
        <div id="contactShow${i}"></div>
        `;
}

function contactListTemp(id, initials, name, email){
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

function slideContact(id){
  let divContacts = document.getElementById('showContact');
    if(divContacts.style.transform == 'translatex(150vw)'){
        divContacts.style.transform = 'translatex(0)';
        showContact(id);
    }else{
        divContacts.style.transform = 'translatex(150vw)';
        setTimeout(() => {
            divContacts.style.transform = 'translatex(0)';
            showContact(id);
        }, 250);
    }
}

function savePopup(saveInfo){
  let savePopup = document.getElementById('save_info');
  savePopup.innerHTML = 'Contact succesfully created'
  if(saveInfo == 'edit'){
    savePopup.innerHTML = 'Contact succesfully saved';
  }else if(saveInfo == 'delete'){
    savePopup.innerHTML = 'Contact deleted';
  }else if(saveInfo == 'exist'){
    savePopup.innerHTML = 'Contact Exist';
  }
  savePopup.style.transform = 'translatex(0)';
  setTimeout(() => {
    savePopup.style.transform = 'translatex(150vw)';
  }, 1500);
}


function popupNames(contactAdd){
  if(contactAdd == 'add'){
      return /*html*/`
      <p class="popupTop">Add contact</p>
      <p class="popupBottom">Tasks are better with a team!</p>
      <div class="popupBottomLine"></div>
  `;
  }else{
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
  open.style.display = 'none';
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

/*Contacts Templates*/

/*Login and Sign up Templates*/
function loginstart() {
  return /*html*/`
  <div class="loginHeader">Log in
      <div class="line"></div>
  </div>
  <div class="loginForm" id="loginForm">
      <div class="input" id="wrongUserEmail"><input type="email" id="userEmail" placeholder="Email" required><img src="./img/emailContact.svg"></div>
      <div class="input" id="wrongUserPass"><input type="password" placeholder="Password" id="passwordchangePW" onclick="changePWImg('changePW'); notClose(event)" required><img id="changePW" src="./img/password.svg"></div>
      <div id="wrong"></div>
      <div class="checkbox" id="checkbox">
        <img onclick="rememberMe(); notClose(event)" id="remeCheck" src="./img/unchecked.svg"> Remember me
      </div>
  </div>
  <div class="loginButton">
      <button class="button" type="submit">Log in</button>
      <a href="javascript:void(0)" onclick="daLogin()">Guest Log in</a>
  </div>
  `;
}

function sign_upStart() {
  return /*html*/`
  <div class="loginHeader"><img onclick="loginSite(); notClose(event)" class="backTo" src="./img/backTo.svg">Sign Up
      <div class="line"></div>
  </div>
  <div class="loginForm" id="loginForm">
  <div class="input"><input type="text" placeholder="Name" id="name" required><img src="./img/personContact.svg"></div>
      <div class="input" id="emailwrong"><input type="email" placeholder="Email" id="email" required><img src="./img/emailContact.svg"></div>
      <div class="input"><input type="password" placeholder="Password" id="passwordchangePWsign" onclick="changePWImg('changePWsign'); notClose(event)" required><img id="changePWsign" src="./img/password.svg"></div>
      <div class="input" id="pwwrong"><input type="password" placeholder="Confirm Password" id="passwordchangePWsignC" onclick="changePWImg('changePWsignC'); notClose(event)" required><img id="changePWsignC" src="./img/password.svg"></div>
      <div id="wrong"></div>
      <div class="checkbox" id="checkbox">
        <img onclick="rememberMe(); notClose(event)" id="remeCheck" src="./img/unchecked.svg"> 
        I accept the <a class="privacy" href="privacy_policy.html?ext" target="_blank">Privacy policy</a>
      </div>
  </div>
  <div class="loginButton" id="disabled">
      <button type="submit" class="buttonDisabled" id="anable" disabled>Sign up</button>
  </div>
  `;
}
/*Login and Sign up Templates*/