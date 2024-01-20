const PozoviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function callAjax(method, url, fnCallback, data = null) {
        const ROOT = "http://localhost:3000"

        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                const jsonRes = JSON.parse(ajax.responseText)

                if (ajax.status === 200) {
                    fnCallback(null, jsonRes)
                } else if (ajax.status === 500) {
                    throw new Error(`Greška na serveru: ${jsonRes.greska}`)
                } else {
                    fnCallback(jsonRes, null)
                }
            }
        }

        ajax.open(method, `${ROOT}${url}`)
        ajax.setRequestHeader("Content-Type", "application/json")

        if (data) {
            ajax.send(JSON.stringify(data))
        } else {
            ajax.send()
        }
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        callAjax("GET", "/korisnik", fnCallback)
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        callAjax("PUT", "/korisnik", fnCallback, noviPodaci)
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        callAjax("POST", "/upit", fnCallback, {
            nekretnina_id: nekretnina_id,
            tekst_upita: tekst_upita
        })
    }

    function impl_getNekretnine(fnCallback) {
        callAjax("GET", "/nekretnine", fnCallback)
    }

    function impl_postLogin(username, password, fnCallback) {
        callAjax("POST", "/login", fnCallback, {
            username: username,
            password: password
        })
    }

    function impl_postLogout(fnCallback) {
        callAjax("POST", "/logout", fnCallback)
    }

    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        callAjax("GET", `/nekretnina/${nekretnina_id}`, fnCallback)
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById: impl_getNekretninaById
    }
})()