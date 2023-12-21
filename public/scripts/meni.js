function addMeni(loggedIn) {
    const meni = document.getElementById('meni')

    const menuList = document.createElement("div")
    menuList.id = "menu_list"

    if (loggedIn) {
        meni.innerHTML = `
            <a href="./profil.html">Profil</a>
        `
    }

    meni.innerHTML += `
        <a href="./nekretnine.html">Nekretnine</a>
        <a href="./detalji.html">Detalji</a>
    `

    if (loggedIn) {
        meni.innerHTML += `
            <a href="/logout">Odjava</a>
        `
    } else {
        meni.innerHTML += `
            <a href="./prijava.html">Prijava</a>
        `
    }

    meni.appendChild(menuList)
}