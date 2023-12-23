function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const data = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    const itemList = document.createElement('div')
    itemList.classList.add("itemList")

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
            <button type="submit">Detalji</button>
            `

        itemList.appendChild(itemFrame)
    })

    divReferenca.appendChild(itemList)
}

import {PozoviAjax} from "../../ajax.js";

PozoviAjax.getNekretnine((err, listaNekretnina) => {
    const divStan = document.getElementById("stan");
    const divKuca = document.getElementById("kuca");
    const divPp = document.getElementById("pp");

    // instanciranje modula
    let nekretnine = SpisakNekretnina();
    nekretnine.init(listaNekretnina);

    // pozivanje funkcije
    spojiNekretnine(divStan, nekretnine, "Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
});