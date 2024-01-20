const dao = (() => {
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

    const marketing = sequelize.define("marketing", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pretrage: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        klikovi: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })

    nekretnina.hasOne(marketing, {
        foreignKey: "nekretnina_id"
    })

    function impl_sync() {
        sequelize.sync()
    }

    function getById(table, id) {
        return table.findByPk(id)
    }

    function getAll(table) {
        return table.findAll()
    }

    function impl_getKorisnik(id) {
        return getById(korisnik, id)
    }

    function impl_getKorisnikByUsername(username) {
        return korisnik.findOne({
            where: {
                username: username
            }
        })
    }

    function impl_getNekretnina(id) {
        return getById(nekretnina, id)
    }

    function impl_getAllNekretnina() {
        return getAll(nekretnina)
    }

    function impl_getUpit(id) {
        return getById(upit, id)
    }

    function impl_getMarketing(id) {
        return getById(marketing, id)
    }

    function impl_getMarketingByNekretninaIds(ids) {
        return new Promise((resolve, reject) => {
            try {
                const statistike = ids.map(async id => {
                    const [instance, created] = await marketing.findOrCreate({
                        where: {
                            nekretnina_id: id
                        }
                    })

                    return instance
                })

                resolve(statistike)
            } catch (e) {
                reject(e)
            }
        })
    }

    function impl_getMarketingByNekretninaId(id) {
        return marketing.findOrCreate({
            where: {
                nekretnina_id: id
            }
        })
    }

    function create(table, values) {
        return table.create(values)
    }

    function impl_createKorisnik(ime, prezime, username, password) {
        return create(korisnik, {
            ime: ime,
            prezime: prezime,
            username: username,
            password: password
        })
    }

    function impl_createNekretnina(tip_nekretnine, naziv, kvadratura, cijena, tip_grijanja, lokacija, godina_izgradnje, datum_objave, opis) {
        return create(nekretnina, {
            tip_nekretnine: tip_nekretnine,
            naziv: naziv,
            kvadratura: kvadratura,
            cijena: cijena,
            tip_grijanja: tip_grijanja,
            lokacija: lokacija,
            godina_izgradnje: godina_izgradnje,
            datum_objave: datum_objave,
            opis: opis
        })
    }

    function impl_createUpit(korisnik_id, nekretnina_id, tekst_upita) {
        return create(upit, {
            korisnik_id: korisnik_id,
            nekretnina_id: nekretnina_id,
            tekst_upita: tekst_upita
        })
    }

    function impl_createMarketing(nekretnina_id, pretrage, klikovi) {
        return create(marketing, {
            nekretnina_id: nekretnina_id,
            pretrage: pretrage,
            klikovi: klikovi
        })
    }

    function impl_saveALl(models) {
        return new Promise((resolve, reject) => {
            try {
                const promises = models.map(model => model.save())

                Promise.all(promises)
                    .then(results => {
                        resolve(results)
                    })
                    .catch(err => {
                        reject(err)
                    })
            } catch (e) {
                reject(e)
            }
        })
    }

    return {
        sync: impl_sync,
        getKorisnik: impl_getKorisnik,
        getKorisnikByUsername: impl_getKorisnikByUsername,
        getNekretnina: impl_getNekretnina,
        getAllNekretnina: impl_getAllNekretnina,
        getUpit: impl_getUpit,
        getMarketing: impl_getMarketing,
        getMarketingByNekretninaIds: impl_getMarketingByNekretninaIds,
        getMarketingByNekretninaId: impl_getMarketingByNekretninaId,
        createKorisnik: impl_createKorisnik,
        createNekretnina: impl_createNekretnina,
        createUpit: impl_createUpit,
        createMarketing: impl_createMarketing,
        saveAll: impl_saveALl
    }
})()

module.exports = dao