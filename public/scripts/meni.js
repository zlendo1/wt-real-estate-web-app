function addMeni(loggedIn) {
    const meni = document.getElementById('meni')

    const menuList = document.createElement("div")
    menuList.id = "menu_list"

    if (loggedIn) {
        meni.innerHTML = `
            <a href="http://localhost:3000/profil">Profil</a>
        `
    }

    meni.innerHTML += `
        <a href="http://localhost:3000">Nekretnine</a>
        <a href="http://localhost:3000/detalji">Detalji</a>
    `

    // TODO: This logout link is absolutely fucked, we'll change this later
    if (loggedIn) {
        meni.innerHTML += `
            <a href="http://localhost:3000/logout">Odjava</a>
        `
    } else {
        meni.innerHTML += `
            <a href="http://localhost:3000/prijava">Prijava</a>
        `
    }

    meni.appendChild(menuList)
}

import {PozoviAjax} from "../../ajax.js"

PozoviAjax.getKorisnik((_, user) => {
    const loggedIn = user !== null

    addMeni(loggedIn)
})