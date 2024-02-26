let onlineUser = [];
let yourId;
let onlineName = [];

async function initOnline() {
    await loadOnlineUsers();
    initals();
    widthSize();
}

/**Load All User as Online Storage and Online Status as Local Storage */
async function loadOnlineUsers() {
    try {
        onlineUser = JSON.parse(await getItem(`${contactsKey}`));
        yourId = await JSON.parse(localStorage.getItem('userOnline'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**Find Log Status */
function logout(userFind) {
    if (userFind != 'guest') {
        userOnline();
    } else {
        window.open('index.html', '_self');
    }
}

/**Log User out and clear Data Online- and Localstorage */
async function userOnline() {
    for (let i = 0; i < onlineUser.length; i++) {
        let userID = onlineUser[i]['email'];
        if (yourId == userID) {
            onlineUser[i]['online'] = false;
            await setItem('allContacts', JSON.stringify(onlineUser));
            localStorage.setItem('userOnline', JSON.stringify(null));
            window.open('index.html', '_self');
        }
    }
}

/**Set Initals in Header button */
async function initals() {
    let initial = document.getElementById('initals');
    let logout = document.getElementById('logoutButton');

    if (yourId != null) {
        await setUserData();
    } else {
        initial.innerHTML = 'G';
        logout.setAttribute('onclick', `logout('guest')`);
    }
}

/**Save User Name in onlineName, Split name to Initails and and Set Attribute from logout Button*/
async function setUserData(){
    let initial = document.getElementById('initals');
    let logout = document.getElementById('logoutButton');
    for (let i = 0; i < onlineUser.length; i++) {
        if (onlineUser[i]['email'] == yourId) {
            names = onlineUser[i]['name'];
            onlineName.push(names);
            let nameParts = names.split(" ");
            initial.innerHTML = nameParts.map(part => part.charAt(0)).join("");
            logout.setAttribute('onclick', `logout('${yourId}')`);
        }
    }
}

/**Function for show Screen of Logout, Privacy Policy and Legal Notice */
function openUser() {
    let open = document.getElementById('logoutScreen');
    if (open.style.display == 'flex') {
        open.style.display = 'none';
    } else {
        open.style.display = 'flex';
    }
}

/**Check Width Size for Responsiv */
async function widthSize() {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width <= 850) {
        subtitleMobile();
    } else {
        subtitle();
    }
}

/**Set Responsiv as Header Title and Logo */
function subtitleMobile(){
    let subtitleHeader = document.getElementById('subtitleHeader');
    if (subtitleHeader) {
        subtitleHeader.classList.remove('headerText');
        subtitleHeader.classList.add('headerMobile');
        subtitleHeader.innerHTML = '<img class="mobileLogo" src="./img/join_logo_dark.svg">';
    }
}

/**Set Header Title */
function subtitle(){
    let subtitleHeader = document.getElementById('subtitleHeader');
    if (subtitleHeader) {
        subtitleHeader.classList.remove('headerMobile');
        subtitleHeader.classList.add('headerText');
        subtitleHeader.innerHTML = 'Kanban Project Management Tool';
    }
}

/**Event Listener for automate Width Size */
window.addEventListener("resize", function () {
    widthSize();
});

/**Function doesn't close when body is clicked */
function notClose(event) {
    event.stopPropagation();
  }