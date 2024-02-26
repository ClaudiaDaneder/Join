/**Login Template*/
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

/**Sign Up Template */
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