function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

/*Contacts Templates*/

function popupTempForm(nameShow, emailShow, phoneShow, button){
  return /*html*/`
        <img src="./img/clearcontackt.svg">
        <form action="#" onsubmit="createContact(); return false">
            <div class="input"><input type="text" id="name" value="${nameShow}" placeholder="Name" required><img src="./img/personContact.svg"></div>
            <div class="input"><input type="email" id="email" value="${emailShow}" placeholder="E-Mail" required><img src="./img/emailContact.svg"></div>
            <div class="input"><input type="text" id="phone" value="${phoneShow}" placeholder="Phone" required><img src="./img/phoneContact.svg"></div>
            <div class="popupButton">
                <div class="cancel" onclick="closePopup()">Cancel <img src="./img/addtask_icon_cancel_dark.svg"></div>
                <button type="submit">${button} contact <img src="./img/addtask_icon_check.svg"></button>
            </div>
        </form>`;
}

function loadContactShow(id, initials, name, email, phone){
  return /*html*/`
  <div class="cHeader">
      <div class="circle cwidth" id="circle${id}">${initials}</div>
      <div class="contactName">
          <p class="cName">${name}</p>
          <div class="edit">
              <p onclick="notClose(event), editContact(${id})"><img src="./img/edit.svg">Edit</p>
              <p><img src="./img/delete.svg">Delete</p>
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
  <div class="list" id="cID${id}" onclick="showContact(${id})">
          <div class="circle" id="listCircle${id}">${initials}</div>
          <div class="contactNameList">
              <p class="listName">${name}</p>
              <p class="listEmail">${email}</p>
          </div>
      </div>
  `;
}
/*Contacts Templates*/