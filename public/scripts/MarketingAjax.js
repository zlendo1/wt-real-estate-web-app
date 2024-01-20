const MarketingAjax = (() => {
    let calledFilter = true
    let divExpandedFrame = null

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

        function fnCallback(err, data) {
            if (err) {
                throw new Error(`This literally wasn't supposed to happen: ${err}`)
            }

            calledFilter = true
            divExpandedFrame = null
        }

        callAjax("POST", "/nekretnine", fnCallback, { nizNekretnina: idNekretnina})
    }

    function impl_klikNekretnina(idNekretnine) {
        function fnCallback(err, data) {
            if (err) {
                throw new Error(`This literally wasn't supposed to happen: ${err}`)
            }

            const setHideOnOtvoriDetalji = (toHide) => {
                const otvoriDetaljeButton = divExpandedFrame.getElementsByClassName("otvoriDetaljeButton")[0]
                otvoriDetaljeButton.hidden = toHide
            }

            if (divExpandedFrame) {
                divExpandedFrame.classList.remove("expanded")

                setHideOnOtvoriDetalji(true)
            }

            divExpandedFrame = document.getElementById(`detalji-${idNekretnine}`).parentElement
            divExpandedFrame.classList.add("expanded")

            setHideOnOtvoriDetalji(false)
        }

        callAjax("POST", `/nekretnina/${idNekretnine}`, fnCallback)
    }

    // Deprecated code
    function _osvjezi(className, divNekretnine) {
        const fnCallback = (err, data) => {
            if (err) {
                return
            }

            calledFilter = false

            for (let statistika of data) {
                const divStatistika = document.getElementById(`${className}-${statistika.id}`)

                divStatistika.innerHTML = statistika[className]
                divStatistika.hidden = false
            }
        }

        const extractInt = (str) => {
            const numberRegex = /\d+/

            return parseInt(str.match(numberRegex)[0])
        }


        const getIdNekretnine = () => {
            const divCollection = divNekretnine.getElementsByClassName(className)

            return Array.from(divCollection).map(div => extractInt(div.id))
        }

        const detaljiId = !divExpandedFrame ? null : extractInt(divExpandedFrame.getElementsByClassName("detaljiButton")[0].id)

        callAjax("POST", `/osvjezi`, fnCallback,
            !calledFilter ? null : { nizNekretnina: detaljiId ? [detaljiId] : getIdNekretnine() })
    }

    function impl_osvjeziPretrage(divNekretnine) {
        _osvjezi("pretrage", divNekretnine)
    }

    function impl_osvjeziKlikove(divNekretnine) {
        _osvjezi("klikovi", divNekretnine)
    }

    function impl_osvjezi(divNekretnine) {
        const fnCallback = (err, data) => {
            if (err) {
                return
            }

            calledFilter = false

            for (let statistika of data) {
                const divPretrage = document.getElementById(`pretrage-${statistika.nekretnina_id}`)
                const divKlikovi = document.getElementById(`klikovi-${statistika.nekretnina_id}`)

                divPretrage.innerHTML = statistika.pretrage
                divKlikovi.innerHTML = statistika.klikovi

                divPretrage.hidden = false
                divKlikovi.hidden = false
            }
        }

        const extractInt = (str) => {
            const numberRegex = /\d+/

            return parseInt(str.match(numberRegex)[0])
        }

        const getIdNekretnine = () => {
            const divCollection = divNekretnine.getElementsByClassName("pretrage")

            return Array.from(divCollection).map(div => extractInt(div.id))
        }

        const detaljiId = !divExpandedFrame ? null : extractInt(divExpandedFrame.getElementsByClassName("detaljiButton")[0].id)

        callAjax("POST", `/osvjezi`, fnCallback,
            !calledFilter ? null : { nizNekretnina: detaljiId ? [detaljiId] : getIdNekretnine() })
    }

    return {
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        osvjezi: impl_osvjezi
    }
})()