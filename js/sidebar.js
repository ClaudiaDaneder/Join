function enableNavigation() {
    document.querySelectorAll('.aria').forEach(link => {
        if (link.href === window.location.href) {
            link.setAttribute('aria-current', 'page');
        }
    })
}

function navigation(show){
    let navigation = document.getElementById('navigation_link');
    let header = document.getElementById('header_link');
    if(show == 'show'){
        navigation.style.display = 'flex';
        header.style.display = 'flex';
    }
}