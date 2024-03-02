async function helpInit() {
    await includeHTML();
    await initOnline();
    await navigation('show')
    linkLast();
}

/**
 * This function hides the help symbol when you are on the page 
 */
function linkLast() {
    let site = window.location;
    let html = site.href.substring(site.href.lastIndexOf('/') + 1);
    if (html == 'help.html') {
        doc('helpHeader').style.display = 'none';
    }
}

function closePopup() {
    if (doc('logoutScreen').style.display == 'flex') {
        doc('logoutScreen').style.display = 'none';
    }
}