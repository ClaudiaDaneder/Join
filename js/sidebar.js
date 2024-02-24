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
        navigation.style.display = 'flex';
        header.style.display = 'flex';
}