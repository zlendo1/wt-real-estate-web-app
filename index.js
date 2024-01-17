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

    function impl_write(fileName, content) {
        return fs.writeJson(`./data/${fileName}.json`, content)
    }

    return {
        read: impl_read,
        write: impl_write
    }
})()

const Sequelize = require("sequelize")
const sequelize = new Sequelize("wt24", "root", "password", {
    host: "localhost",
    dialect: "mysql",
    logging: false
})

const korisnik = sequelize.define("korisnik", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ime: {
        type: Sequelize.STRING,
        allowNull: false
    },
    prezime: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-zA-Z0-9_]+$/
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const nekretnina = sequelize.define("nekretnina", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tip_nekretnine: {
        type: Sequelize.STRING,
        allowNull: false
    },
    naziv: {
        type: Sequelize.STRING,
        allowNull: false
    },
    kvadratura: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cijena: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    tip_grijanja: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lokacija: {
        type: Sequelize.STRING,
        allowNull: false
    },
    godina_izgradnje: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    datum_objave: {
        type: Sequelize.STRING,
        allowNull: false
    },
    opis: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const upit = sequelize.define("upit", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tekst_upita: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

nekretnina.hasMany(upit, {
    foreignKey: "nekretnina_id"
})

korisnik.hasMany(upit, {
    foreignKey: "korisnik_id"
})

sequelize.sync()

// Routes
// TODO: Implement sequelize in these routes
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

    data.read("korisnici")
        .then(korisnici => {
            const user = korisnici.find(korisnik => korisnik.username === bodyUsername)

            if (!user) {
                res.status(401).send(
                    {greska: "Neuspješna prijava"}
                )

                return
            }

            bcrypt.compare(bodyPassword, user.password, (err, result) => {
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

                req.session.user = user

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

// TODO: Upiti will be moved from nekretnine to a seperate table, this has to be modified
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

            return data.write("nekretnine", nekretnine)
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(() => {
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

            return data.write("korisnici", korisnici)
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
    data.read("nekretnine")
        .then(nekretnine => {
            res.status(200).send(
                nekretnine
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

    data.read("marketing")
        .then(statistike => {
            for (let id of idNekretnina) {
                let statistika = statistike.find(statistika => statistika.id === id)

                if (!statistika) {
                    statistike.push({
                        id: id,
                        pretrage: 1,
                        klikovi: 0
                    })
                } else {
                    statistika.pretrage += 1
                }
            }

            return data.write("marketing", statistike)
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(() => {
            res.status(200).send()
        })
})

app.post("/marketing/nekretnina/:id", (req, res) => {
    const id = parseInt(req.params.id)

    data.read("marketing")
        .then(statistike => {
            let statistika = statistike.find(statistika => statistika.id === id)

            if (!statistika) {
                statistike.push({
                    id: id,
                    pretrage: 1,
                    klikovi: 0
                })
            } else {
                statistika.klikovi += 1
            }

            return data.write("marketing", statistike)
        })
        .catch(err => {
            res.status(500).send(
                {greska: err.message}
            )
        })
        .then(() => {
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

    data.read("marketing")
        .then(statistike => {
            let result = []

            for (let id of idNekretnina) {
                let statistika = statistike.find(statistika => statistika.id === id)

                if (!statistika) {
                    result.push({
                        id: id,
                        pretrage: 1,
                        klikovi: 0
                    })
                } else {
                    result.push(statistika)
                }
            }

            res.status(200).send(
                result
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