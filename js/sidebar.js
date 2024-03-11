/**
 * This function enables the sidebar to check what page the user is currently on and indicates the position.
 */
function enableNavigation() {
    document.querySelectorAll('.aria').forEach(link => {
        if (link.href === window.location.href) {
            link.setAttribute('aria-current', 'page');
        }
    })
}

/**
 * This function is used to change the function of the "back" arrows depending on whether the user has opened the page from within the application or from outside (i.e. the login screens)
 */
async function navigation(){
    let navigation = document.getElementById('navigation_link');
    let header = document.getElementById('header_link');
    let site = window.location;
    let html = site.href.substring(site.href.lastIndexOf('?') + 1);
    let ln = document.getElementById('ln');
    let pp = document.getElementById('pp');
    let arrowBack = document.getElementById('arrowBack');
    if(html != 'ext'){
        navigation.style.display = 'flex';
        header.style.display = 'flex';
        if(arrowBack){
            arrowBack.setAttribute('onclick', 'history.back()');
        }
    }else{
        pp.setAttribute('href', '../privacy_policy.html?ext');
        ln.setAttribute('href', '../legal_notice.html?ext');
    }
}