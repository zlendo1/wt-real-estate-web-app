function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const data = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    const ul = document.createElement('ul')

    data.forEach(item => {
        const listItem = document.createElement('li')

        const imageName = {
            "Stan": "apartments",
            "Kuća": "house",
            "Poslovni prostor": "office"
        }[tip_nekretnine]

        listItem.innerHTML = `
            <img src="../res/${imageName}.png" alt="stan">
            <p class="naziv">${item.tip_nekretnine}</p>
            <p class="kvadratura">${item.kvadratura} m^3</p>
            <p class="cijena">${item.cijena} KM</p>
            <button type="submit">Detalji</button>
            `

        ul.appendChild(listItem)
    })

    divReferenca.appendChild(ul)
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
        {
            korisnik_id: 2,
            tekst_upita: "Phasellus viverra nulla."
        }]
},
    {
        id: 2,
        tip_nekretnine: "Poslovni prostor",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [{
            korisnik_id: 2,
            tekst_upita: "Integer tincidunt."
        }
        ]
    }]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
    {
        id: 2,
        ime: "Neko2",
        prezime: "Nekic2",
        username: "username2",
    }]

// instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

// pozivanje funkcije
spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");