function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine, kriterij = {}) {
    const newKriterij = { ...kriterij, tip_nekretnine: tip_nekretnine }

    const data = instancaModula.filtrirajNekretnine(newKriterij);

    const itemListCollection = Array.from(divReferenca.getElementsByClassName("itemList"))

    const itemList = itemListCollection.length > 0 ? itemListCollection[0] : document.createElement('div')
    itemList.classList.add("itemList")

    itemList.innerHTML = ""     // Delete all children

    data.forEach(item => {
        const itemFrame = document.createElement('div')
        itemFrame.classList.add("itemFrame")

        const imageNames = {
            "Stan": "apartments",
            "Kuća": "house",
            "Poslovni prostor": "office"
        }

        itemFrame.innerHTML = `
            <img class="centerHorizontal" src="../res/${imageNames[item.tip_nekretnine]}.png" alt="stan">
            <div class="naziv">${item.naziv}</div>
            <div class="kvadratura">${item.kvadratura} m^3</div>
            <div class="lokacija">${item.lokacija}</div>
            <div class="godinaIzgradnje">${item.godina_izgradnje}</div>
            <div class="cijena alignRight">${item.cijena} KM</div>
            <div class="statistikaGrid">
                <div>Broj pretraga:</div>
                <div class="pretrage alignRight" id="pretrage-${item.id}" hidden></div>
                <div>Broj klikova:</div>
                <div class="klikovi alignRight" id="klikovi-${item.id}" hidden></div>
            </div>
            `

        const button = document.createElement("button")

        button.classList.add("detaljiButton")
        button.id = `detalji-${item.id}`
        button.innerText = "Detalji"

        button.addEventListener('click', (event) => {
            MarketingAjax.klikNekretnina(item.id)
        })

        itemFrame.appendChild(button)

        const otvoriDetaljeButton = document.createElement("button")

        otvoriDetaljeButton.classList.add("otvoriDetaljeButton")
        otvoriDetaljeButton.hidden = true
        button.innerText = "Otvori detalje"

        otvoriDetaljeButton.addEventListener('click', (event) => {
            // TODO: Implement transition on click
        })

        itemFrame.appendChild(otvoriDetaljeButton)

        itemList.appendChild(itemFrame)
    })

    divReferenca.appendChild(itemList)
}

PozoviAjax.getNekretnine((err, listaNekretnina) => {
    const divStan = document.getElementById("stan");
    const divKuca = document.getElementById("kuca");
    const divPp = document.getElementById("pp");

    const spojiSveNekretnine = (kriterij = {}) => {
        spojiNekretnine(divStan, nekretnine, "Stan", kriterij);
        spojiNekretnine(divKuca, nekretnine, "Kuća", kriterij);
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor", kriterij);

        MarketingAjax.novoFiltriranje(nekretnine.filtrirajNekretnine(kriterij))
    }

    // instanciranje modula
    let nekretnine = SpisakNekretnina();
    nekretnine.init(listaNekretnina);

    spojiSveNekretnine()

    const pretragaForm = document.getElementById("pretraga_form")

    pretragaForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData(pretragaForm)

        const kriterij = {}
        for (let [key, value] of formData.entries()) {
            kriterij[key] = value.length > 0 ? parseInt(value) : undefined
        }

        spojiSveNekretnine(kriterij)
    })

    const divNekretnine = document.getElementById("nekretnine_container")

    const updateStats = () => {
        MarketingAjax.osvjezi(divNekretnine)
    }

    setInterval(updateStats, 500)
});