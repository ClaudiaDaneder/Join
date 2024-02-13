let remeChecked = [0];

function logoSize(){
    let login = document.getElementById('login');
    let logoIMG = document.getElementById('logoIMG');
    setTimeout(() => {
        logoIMG.classList.add('selected');
        login.style.display = 'flex';
    }, 1000);
}

function rememberMe(){
    let img = document.getElementById('reme');
    let host = window.location.protocol + "//" + window.location.host;
    if(img.src == `${host}/img/unchecked.svg`){
        img.src = './img/checked.svg';
        remeChecked = [1];
    }else{
        img.src = './img/unchecked.svg';
        remeChecked = [0];
    }
}

function changePWImg(){
    let img = document.getElementById("changePW");
    img.src = './img/password_dont.svg';
    img.setAttribute('onclick','changeShow()');
}

function changeShow(){
    let pwInput = document.getElementById("password");
    let img = document.getElementById("changePW");
    if(pwInput.type == 'password'){
        pwInput.setAttribute('type', 'text');
        img.src = './img/password_show.svg';
    }else{
        pwInput.setAttribute('type', 'password');
        img.src = './img/password_dont.svg';
    }
}