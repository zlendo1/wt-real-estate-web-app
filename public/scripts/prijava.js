const loginForm = document.getElementById('login_form')

loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(loginForm)

    const data = {}
    for (let [key, value] of formData.entries()) {
        data[key] = value
    }

    PozoviAjax.postLogin(data.username, data.password, (err, res) => {
        if (err) {
            alert(err.greska)

            return
        }

        window.location.href = "http://localhost:3000/"
    })
})