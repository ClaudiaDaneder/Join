async function initPrivacyPolicy() {
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}

function closePopup() {
    if (doc('logoutScreen').style.display == 'flex') {
        doc('logoutScreen').style.display = 'none';
    }
}