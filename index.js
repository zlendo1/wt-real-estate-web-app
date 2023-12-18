const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000 // Port we will listen on

app.use(express.json()) // for parsing application/json

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

const bcrypt = require("bcrypt")

const korisnici = import("./data/korisnici.json")
const nekretnine = import("./data/nekretnine.json")

// Routes
app.post('/login', (req, res) => {
    const requestBody = req.body

    const bodyUsername = requestBody.username
    const bodyPassword = requestBody.password

    const matchingUser = korisnici.find(
        korisnik => korisnik.username === bodyUsername && bcrypt.compareSync(bodyPassword, korisnik.password)
    )

    if (!matchingUser) {
        res.status(401).send(
            {"greska": "Neuspješna prijava"}
        )
    } else {
        req.session.user = matchingUser

        res.status(200).send(
            {"poruka": "Uspješna prijava"}
        )
    }
})

app.post("/logout", (req, res) => {
    if (!req.session.user) {
        res.status(401).send(
            {greska: "Neautorizovan pristup"}
        )
    } else {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send(
                    {greska: "Greška pri odjavi"}
                )
            } else {
                res.status(200).send(
                    {poruka: "Uspješno ste se odjavili"}
                )
            }
        })
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})