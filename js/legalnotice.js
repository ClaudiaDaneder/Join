async function initLegalNotice() {
    await includeHTML();
    await initOnline();
    await enableNavigation();
    navigation('show');
}