async function helpInit(){
    await includeHTML();
    await initOnline();
    await navigation('show')
    linkLast();
}

function linkLast(){
    let site = window.location;
    let html = site.href.substring(site.href.lastIndexOf('/') + 1);
    let helpIcon = document.getElementById('helpHeader');
    if(html == 'help.html'){
        helpIcon.style.display = 'none';
    }
}