const express = require('express')
const app = express()
const port = 3000 // Port we will listen on

app.use(express.json()) // for parsing application/json
app.use(express.static(`${__dirname}/public`)) // for serving static files

const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

const bcrypt = require("bcrypt")

const fs = require("fs-extra")

const data = (() => {
    function impl_read(fileName) {
        return fs.readJson(`./data/${fileName}.json`)
    }

    function impl_write(fileName) {
        return fs.writeJson(`./data/${fileName}.json`)
    }

    return {
        read: impl_read,
        write: impl_write
    }
})()

// Routes
app.post('/login', (req, res) => {
    if (req.session.user) {
        res.status(403).send(
            {greska: "Već ste prijavljeni"}
        )

        return
    }

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

        data.read("korisnici")
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

    data.read("nekretnine")
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

            data.write("nekretnine")
                .then(() => {
                    res.status(200).send(
                        {poruka: "Upit je uspješno dodan"}
                    )
                })
                .catch(err => {
                    res.status(500).send(
                        {greska: "Greška u čitanju nekretnina"}
                    )
                })
        })
        .catch(err => {
            res.status(500).send(
                {greska: "Greška u čitanju nekretnina"}
            )
        })
})

app.put("/korisnik", (req, res) => {
    if (!req.session.user) {
        res.status(401).send(
            {greska: "Neautorizovan pristup"}
        )

        return
    }

    const requestBody = req.body

    const bodyIme = requestBody["ime"]
    const bodyPrezime = requestBody["prezime"]
    const bodyUsername = requestBody["username"]
    const bodyPassword = requestBody["password"]

    data.read("korisnici")
        .then(korisnici => {
            let matchingUser = korisnici.find(korisnik => korisnik.id === req.session.user.id)

            if (!matchingUser) {
                res.status(500).send(
                    {greska: `Session user ne postoji u bazi`}
                )

                return
            }

            if (bodyIme) {
                matchingUser.ime = bodyIme
                req.session.user.ime = bodyIme
            }

            if (bodyPrezime) {
                matchingUser.prezime = bodyPrezime
                req.session.user.prezime = bodyPrezime
            }

            if (bodyUsername) {
                matchingUser.username = bodyUsername
                req.session.user.username = bodyUsername
            }

            if (bodyPassword) {
                bcrypt.hash(bodyPassword, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send(
                            {greska: "Greška u enkripciji lozinke"}
                        )

                        return
                    }

                    matchingUser.password = hash
                    req.session.user.password = hash
                })
            }

            data.write("korisnici")
                .then(() => {
                    res.status(200).send(
                        {poruka: "Podaci su uspješno ažurirani"}
                    )
                })
                .catch(err => {
                    res.status(500).send(
                        {greska: "Greška u čitanju korisnika"}
                    )
                })
        })
        .catch(err => {
            res.status(500).send(
                {greska: "Greška u čitanju korisnika"}
            )
        })
})

app.post("/marketing/nekretnine", (req, res) => {

})

app.get("/nekretnine", (req, res) => {
    data.read("nekretnine")
        .then(nekretnine => {
            res.status(200).send(
                nekretnine
            )
        })
        .catch(err => {
            res.status(500).send(
                {greska: "Greška u čitanju nekretnina"}
            )
        })
})

app.get("/", (req, res) => {
    res.sendFile( `${__dirname}/public/html/nekretnine.html`)
})

app.get("/detalji", (req, res) => {
    res.sendFile( `${__dirname}/public/html/detalji.html`)
})

app.get("/prijava", (req, res) => {
    res.sendFile( `${__dirname}/public/html/prijava.html`)
})

app.get("/profil", (req, res) => {
    res.sendFile( `${__dirname}/public/html/profil.html`)
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})