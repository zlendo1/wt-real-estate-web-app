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

        // TODO: This callback is never called, find out why
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

            if (divExpandedFrame) {
                divExpandedFrame.classList.remove("expanded")
            }

            divExpandedFrame = document.getElementById(`detalji-${idNekretnine}`).parentElement
            divExpandedFrame.classList.add("expanded")
        }

        callAjax("POST", `/nekretnina/${idNekretnine}`, fnCallback)
    }

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

    return {
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove
    }
})()