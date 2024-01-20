function logout() {
    PozoviAjax.postLogout((err, res) => {
        if (err) {
            throw new Error(`Error: ${err.greska}. User's shouldn't get this EVER!`)
        }

        window.location.href = "http://localhost:3000"
    })
}

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
    `

    if (loggedIn) {
        menuList.innerHTML += `
            <a href="javascript:logout()">Odjava</a>
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