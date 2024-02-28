async function helpInit(){
    await includeHTML();
    await initOnline();
    await navigation('show')
    linkLast();
}

function linkLast(){
    let site = window.location;
    let html = site.href.substring(site.href.lastIndexOf('/') + 1);
    if(html == 'help.html'){
        doc('helpHeader').style.display = 'none';
    }
}