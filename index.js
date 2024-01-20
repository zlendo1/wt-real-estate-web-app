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

const dao = require("./dao/dao")

dao.sync()

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

    dao.getKorisnikByUsername(bodyUsername)
        .then(korisnik => {
            if (!korisnik) {
                res.status(401).send(
                    {greska: "Neuspješna prijava"}
                )

                return
            }

            bcrypt.compare(bodyPassword, korisnik.password, (err, result) => {
                if (err) {
                    res.status(500).send(
                        {greska: "Greška u provjeri lozinke"}
                    )

                    return
                }

                if (!result) {
                    res.status(401).send(
                        {greska: "Neuspješna prijava"}
                    )

                    return
                }

                req.session.user = korisnik.toJSON()

                res.status(200).send(
                    {poruka: "Uspješna prijava"}
                )
            })
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
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

    dao.getNekretnina(nekretnina_id)
        .then(nekretnina => {
            if (!nekretnina) {
                res.status(400).send(
                    {greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji`}
                )

                return
            }

            const upit = dao.createUpit({
                tekst_upita: tekstUpita,
                korisnik_id: req.session.user.id,
                nekretnina_id: nekretnina_id
            })

            return upit.save()
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(_ => {
            res.status(200).send(
                {poruka: "Upit je uspješno dodan"}
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

    dao.getKorisnik(req.session.user.id)
        .then(matchingUser => {
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

            return matchingUser.save()
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(() => {
            res.status(200).send(
                {poruka: "Podaci su uspješno ažurirani"}
            )
        })
})

app.get("/nekretnine", (req, res) => {
    dao.getAllNekretnina()
        .then(nekretnine => {
            const nekretnineJSON = nekretnine.map(nekretnina => nekretnina.toJSON())

            res.status(200).send(
                nekretnineJSON
            )
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
})

app.post("/marketing/nekretnine", (req, res) => {
    const requestBody = req.body

    const idNekretnina = requestBody["nizNekretnina"]

    dao.getMarketingByNekretninaIds(idNekretnina)
        .then(statistike => {
            for (let statistika of statistike) {
                statistika.pretrage += 1
            }

            return dao.saveAll(statistike)
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(_ => {
            res.status(200).send()
        })
})

app.post("/marketing/nekretnina/:id", (req, res) => {
    const id = parseInt(req.params.id)

    dao.getMarketingByNekretninaId(id)
        .then(statistika => {
            statistika.klikovi += 1

            return statistika.save()
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(_ => {
            res.status(200).send()
        })
})

app.post("/marketing/osvjezi", (req, res) => {
    req.setTimeout(500, () => {
        res.status(408).send(
            {greska: "Zahtjev je istekao"}
        )
    })

    const requestBody = req.body

    if (requestBody["nizNekretnina"]) {
        req.session.idStatistika = requestBody["nizNekretnina"]
    }

    const idNekretnina = req.session.idStatistika

    dao.getMarketingByNekretninaIds(idNekretnina)
        .then(statistike => {
            for (let statistika of statistike) {
                statistika.pretrage += 1
            }

            return dao.saveAll(statistike)
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(statistike => {
            let result = statistike.map(statistika => statistika.toJSON())

            res.status(200).send(
                result
            )
        })
})

app.get("/nekretnina/:id", (req, res) => {
    const id = parseInt(req.params.id)

    dao.getNekretnina(id)
        .then(nekretnina => {
            if (!nekretnina) {
                res.status(400).send(
                    {greska: `Nekretnina sa id-em ${id} ne postoji`}
                )

                return
            }

            res.status(200).send(
                nekretnina.toJSON()
            )
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
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