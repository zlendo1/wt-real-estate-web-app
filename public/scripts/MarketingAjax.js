const MarketingAjax = (() => {
    let calledFilter = true
    let detaljiId = null

    function callAjax(method, url, fnCallback, data = null) {
        const ROOT = "http://localhost:3000/marketing"

        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                const jsonRes = ajax.responseText ? JSON.parse(ajax.responseText) : null

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

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const idNekretnina = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id)

        // TODO: This callback is never called, find out why
        function fnCallback(err, data) {
            if (err) {
                throw new Error(`This literally wasn't supposed to happen: ${err}`)
            }

            calledFilter = true
            detaljiId = null
        }

        callAjax("POST", "/nekretnine", fnCallback, { nizNekretnina: idNekretnina})
    }

    function impl_klikNekretnina(idNekretnine) {
        function fnCallback(err, data) {
            if (err) {
                throw new Error(`This literally wasn't supposed to happen: ${err}`)
            }

            detaljiId = idNekretnine
        }

        callAjax("POST", `/nekretnina/${idNekretnine}`, fnCallback)
    }

    function impl_osvjeziPretrage(divNekretnine) {
        const getIdNekretnine = () => {
            const divPretrageCollection = divNekretnine.getElementsByClassName("pretrage")

            const numberRegex = /\d+/

            return Array.from(divPretrageCollection).map(div => div.id.match(numberRegex)[0])
        }

        function fnCallback(err, data) {
            if (err) {
                return
            }

            calledFilter = false

            for (let statistika of data) {
                const divPretrage = document.getElementById(`pretrage-${statistika.id}`)

                divPretrage.innerHTML = statistika.pretrage
                divPretrage.hidden = false
            }
        }

        callAjax("POST", `/osvjezi`, fnCallback,
            !calledFilter ? null : { nizNekretnina: detaljiId ? [detaljiId] : getIdNekretnine() })
    }

    function impl_osvjeziKlikove(divNekretnine) {
        const getIdNekretnine = () => {
            const divKlikoviCollection = divNekretnine.getElementsByClassName("klikovi")

            const numberRegex = /\d+/

            return Array.from(divKlikoviCollection).map(div => div.id.match(numberRegex)[0])
        }

        function fnCallback(err, data) {
            if (err) {
                return
            }

            for (let statistika of data) {
                const divKlikovi = document.getElementById(`klikovi-${statistika.id}`)

                divKlikovi.innerHTML = statistika.klikovi
                divKlikovi.hidden = false
            }
        }

        callAjax("POST", `/osvjezi`, fnCallback,
            !calledFilter ? null : { nizNekretnina: detaljiId ? [detaljiId] : getIdNekretnine() })
    }

    return {
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove
    }
})()