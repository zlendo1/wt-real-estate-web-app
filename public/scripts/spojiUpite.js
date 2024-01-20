const upitForm = document.getElementById("upitForm")

upitForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const id = parseInt(window.location.href.match(/\/(\d+)$/)[1])

    const tekstUpita = document.getElementById("upitField").value

    PozoviAjax.postUpit(id, tekstUpita, (err, _) => {
        if (err) {
            throw new Error("This should never happen!")
        }

        window.location.reload()
    })
})