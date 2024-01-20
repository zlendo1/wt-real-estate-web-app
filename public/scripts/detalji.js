function load() {
    const id = parseInt(window.location.href.match(/\/(\d+)$/)[1])

    const imageNames = {
        "Stan": "apartments",
        "Kuća": "house",
        "Poslovni prostor": "office"
    }

    PozoviAjax.getNekretninaById(id, (_, item) => {
        const icon = document.getElementById("icon")
        icon.src = `../res/${imageNames[item.tip_nekretnine]}.png`

        const naziv = document.getElementById("naziv")
        naziv.innerText += ` ${item.naziv}`

        const kvadratura = document.getElementById("kvadratura")
        kvadratura.innerText += ` ${item.kvadratura} m^3`

        const cijena = document.getElementById("cijena")
        cijena.innerText += ` ${item.cijena} KM`

        const tipGrijanja = document.getElementById("tipGrijanja")
        tipGrijanja.innerText += ` ${item.tip_grijanja}`

        const lokacija = document.getElementById("lokacija")
        lokacija.innerText += ` ${item.lokacija}`

        const godinaIzgradnje = document.getElementById("godinaIzgradnje")
        godinaIzgradnje.innerText += ` ${item.godina_izgradnje}`

        const datumObjave = document.getElementById("datumObjave")
        datumObjave.innerText += ` ${item.datum_objave}`

        const opis = document.getElementById("opis")
        opis.innerText += ` ${item.opis}`
    })
}