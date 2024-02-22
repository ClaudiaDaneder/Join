let onlineUser = [];
let yourId;

async function initOnline() {
    await loadOnlineUsers();
    initals();
}

async function loadOnlineUsers() {
    try {
        onlineUser = JSON.parse(await getItem(`${contactsKey}`));
        yourId = await JSON.parse(localStorage.getItem('userOnline'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function logout(userFind) {
    if (userFind != 'guest') {
        userOnline();
    } else {
        window.open('index.html', '_self');
    }
}

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

function initals() {
    let initial = document.getElementById('initals');
    let logout = document.getElementById('logoutButton');
    if (yourId != null) {
        for (let i = 0; i < onlineUser.length; i++) {
            if (onlineUser[i]['email'] == yourId) {
                names = onlineUser[i]['name'];
                let nameParts = names.split(" ");
                initial.innerHTML = nameParts.map(part => part.charAt(0)).join("");
                logout.setAttribute('onclick', `logout('${yourId}')`);
            }
        }
    } else {
        initial.innerHTML = 'G';
        logout.setAttribute('onclick', `logout('guest')`);
    }
}



function openUser() {
    let open = document.getElementById('logoutScreen');
    if (open.style.display == 'flex') {
        open.style.display = 'none';
    } else {
        open.style.display = 'flex';
    }
}

function notice() {
    console.log('Notice');
}

function policy() {
    console.log('Policy');
}

