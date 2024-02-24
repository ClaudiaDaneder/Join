function enableNavigation() {
    document.querySelectorAll('.aria').forEach(link => {
        if (link.href === window.location.href) {
            link.setAttribute('aria-current', 'page');
        }
    })
}

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