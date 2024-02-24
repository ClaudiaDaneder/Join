async function initPrivacyPolicy() {
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}