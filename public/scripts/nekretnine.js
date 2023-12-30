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
            <img src="../res/${imageNames[item.tip_nekretnine]}.png" alt="stan">
            <p class="naziv">${item.naziv}</p>
            <p class="kvadratura">${item.kvadratura} m^3</p>
            <p class="cijena">${item.cijena} KM</p>
            <p class="statistikaGrid">
                <p>Broj pretraga:</p>
                <div class="pretrage" id="pretrage-${item.id}" hidden></div>
                <p>Broj klikova:</p>
                <div class="klikovi" id="klikovi-${item.id}" hidden></div>
            </p>
            `

        const button = document.createElement("button")

        button.classList.add("detaljiButton")
        button.id = `detalji-${item.id}`
        button.innerText = "Detalji"

        button.addEventListener('click', (event) => {
            MarketingAjax.klikNekretnina(item.id)
        })

        itemFrame.appendChild(button)

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
        MarketingAjax.osvjeziPretrage(divNekretnine)
        MarketingAjax.osvjeziKlikove(divNekretnine)
    }

    setInterval(updateStats, 500)
});