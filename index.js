const express = require('express')
const app = express()
const port = 3000 // Port we will listen on

app.use(express.json()) // for parsing application/json

const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

const bcrypt = require("bcrypt")

let korisnici = import("./data/korisnici.json")
let nekretnine = import("./data/nekretnine.json")

// Routes
app.post('/login', (req, res) => {
    const requestBody = req.body

    const bodyUsername = requestBody["username"]
    const bodyPassword = requestBody["password"]

    bcrypt.hash(bodyPassword, 10, (err, hash) => {
        if (err) {
            res.status(500).send(
                {greska: "Greška u enkripciji lozinke"}
            )

            return
        }

        korisnici
            .then(korisnici => {
                const matchingUser = korisnici.find(
                    korisnik => korisnik.username === bodyUsername && korisnik.password === hash
                )

                if (!matchingUser) {
                    res.status(401).send(
                        {greska: "Neuspješna prijava"}
                    )

                    return
                }

                req.session.user = matchingUser

                res.status(200).send(
                    {poruka: "Uspješna prijava"}
                )
            })
            .catch(err => {
                res.status(500).send(
                    {greska: "Greška u čitanju korisnika"}
                )
            })
    })
})

app.post("/logout", (req, res) => {
    if (!req.session.user) {
        res.status(401).send(
            {greska: "Neautorizovan pristup"}
        )

        return
    }

    req.session.destroy(err => {
        if (err) {
            res.status(500).send(
                {greska: "Greška u uništavanju sesije"}
            )

            return
        }

        res.status(200).send(
            {poruka: "Uspješno ste se odjavili"}
        )
    })
})

app.get("/korisnik", (req, res) => {
    if (!req.session.user) {
        res.status(401).send(
            {greska: "Neautorizovan pristup"}
        )

        return
    }

    res.status(200).send(
        req.session.user
    )
})

app.post("/upit", (req, res) => {
    if (!req.session.user) {
        res.status(401).send(
            {greska: "Neautorizovan pristup"}
        )

        return
    }
    const requestBody = req.body

    const nekretnina_id = requestBody["nekretnina_id"]
    const tekstUpita = requestBody["tekst_upita"]

    nekretnine
        .then(nekretnine => {
            let nekretnina = nekretnine.find(nekretnina => nekretnina.id === nekretnina_id)

            if (!nekretnina) {
                res.status(400).send(
                    {greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji`}
                )

                return
            }

            nekretnina.upiti.push({
                korisnik_id: req.session.user.id,
                tekst_upita: tekstUpita
            })

            // TODO: Save to file
        })
        .catch(err => {
            res.status(500).send(
                {greska: "Greška u čitanju nekretnina"}
            )
        })
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})