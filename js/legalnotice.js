async function initLegalNotice() {
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}

/**
 * This function closes the user popup on the header.
 */
function closePopup() {
    if (doc('logoutScreen').style.display == 'flex') {
        doc('logoutScreen').style.display = 'none';
    }
}