function addMeni(loggedIn) {
    const meni = document.getElementById('meni')

    const menuList = document.createElement("div")
    menuList.id = "menu_list"

    if (loggedIn) {
        menuList.innerHTML = `
            <a href="http://localhost:3000/profil">Profil</a>
        `
    }

    menuList.innerHTML += `
        <a href="http://localhost:3000">Nekretnine</a>
        <a href="http://localhost:3000/detalji">Detalji</a>
    `

    // TODO: This logout link is absolutely fucked, we'll change this later
    if (loggedIn) {
        menuList.innerHTML += `
            <a href="http://localhost:3000/logout">Odjava</a>
        `
    } else {
        menuList.innerHTML += `
            <a href="http://localhost:3000/prijava">Prijava</a>
        `
    }

    meni.appendChild(menuList)
}

PozoviAjax.getKorisnik((_, user) => {
    const loggedIn = user !== null

    addMeni(loggedIn)
})