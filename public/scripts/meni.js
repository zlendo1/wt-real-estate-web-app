function addMeni(loggedIn) {
    const meni = document.getElementById('meni')

    const menuList = document.createElement("div")
    menuList.id = "menu_list"

    if (loggedIn) {
        meni.innerHTML = `
            <a href="http://localhost:3000/profil.html">Profil</a>
        `
    }

    meni.innerHTML += `
        <a href="http://localhost:3000/nekretnine.html">Nekretnine</a>
        <a href="http://localhost:3000/detalji.html">Detalji</a>
    `

    if (loggedIn) {
        meni.innerHTML += `
            <a href="/logout">Odjava</a>
        `
    } else {
        meni.innerHTML += `
            <a href="http://localhost:3000/prijava.html">Prijava</a>
        `
    }

    meni.appendChild(menuList)
}