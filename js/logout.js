let onlineUser = [];
let yourId;

async function initOnline() {
    await loadOnlineUsers();
    initals();
    widthSize();
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
    let arrowBack = document.getElementById('arrowBack');
    if (yourId != null) {
        for (let i = 0; i < onlineUser.length; i++) {
            if (onlineUser[i]['email'] == yourId) {
                names = onlineUser[i]['name'];
                let nameParts = names.split(" ");
                initial.innerHTML = nameParts.map(part => part.charAt(0)).join("");
                logout.setAttribute('onclick', `logout('${yourId}')`);
                if(arrowBack){
                    arrowBack.setAttribute('onclick', 'history.back()');
                    navigation('show');
                }
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

async function widthSize(){
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let helpHeader = document.getElementById('helpHeader');
    let subtitleHeader = document.getElementById('subtitleHeader');
    if (width <= 850) {
        helpHeader.style.display = 'none';
        subtitleHeader.classList.remove('headerText');
        subtitleHeader.classList.add('headerMobile');
        subtitleHeader.innerHTML = '<img class="mobileLogo" src="./img/join_logo_dark.svg">';
    } else {
        helpHeader.style.display = 'flex';
        subtitleHeader.classList.remove('headerMobile');
        subtitleHeader.classList.add('headerText');
        subtitleHeader.innerHTML = 'Kanban Project Management Tool';
    }
}

window.addEventListener("resize", function () {
    widthSize();
});