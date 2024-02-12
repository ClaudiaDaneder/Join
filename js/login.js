function logoSize(){
    let bg = document.getElementById('bg');
    let logo = document.getElementById('logo');
    let logoIMG = document.getElementById('logoIMG');
    setTimeout(() => {
        bg.style.backgroundColor = 'transparent';
        logo.classList.add('selected');
        logoIMG.classList.add('selected');
        setTimeout(() => {
            bg.style.display = 'none';
        }, 500);
    }, 1000);
}