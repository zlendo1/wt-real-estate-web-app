describe('SpisakNekretnina', function () {
    // Sample data
    let listaNekretnina = [
        {
          id: 1,
          tip_nekretnine: "Stan",
          naziv: "Useljiv stan Sarajevo",
          kvadratura: 58,
          cijena: 232000,
          tip_grijanja: "plin",
          lokacija: "Novo Sarajevo",
          godina_izgradnje: 2019,
          datum_objave: "01.10.2023.",
          opis: "Sociis natoque penatibus.",
          upiti: [
            {
              korisnik_id: 1,
              tekst_upita: "Nullam eu pede mollis."
            },
            {
              korisnik_id: 2,
              tekst_upita: "Phasellus viverra nulla."
            }
          ]
        },
        {
          id: 2,
          tip_nekretnine: "Poslovni prostor",
          naziv: "Mali poslovni prostor",
          kvadratura: 20,
          cijena: 70000,
          tip_grijanja: "struja",
          lokacija: "Centar",
          godina_izgradnje: 2005,
          datum_objave: "20.08.2023.",
          opis: "Magnis dis parturient montes.",
          upiti: [
            {
              korisnik_id: 2,
              tekst_upita: "Integer tincidunt."
            }
          ]
        },
        {
          id: 3,
          tip_nekretnine: "Stan",
          naziv: "Novi stan u Sarajevu",
          kvadratura: 75,
          cijena: 280000,
          tip_grijanja: "plin",
          lokacija: "Stari Grad",
          godina_izgradnje: 2020,
          datum_objave: "15.11.2023.",
          opis: "Lorem ipsum dolor sit amet.",
          upiti: [
            {
              korisnik_id: 3,
              tekst_upita: "Aenean commodo ligula eget dolor."
            }
          ]
        },
        {
          id: 4,
          tip_nekretnine: "Poslovni prostor",
          naziv: "Veliki poslovni prostor",
          kvadratura: 100,
          cijena: 150000,
          tip_grijanja: "centralno",
          lokacija: "Novi Grad",
          godina_izgradnje: 2010,
          datum_objave: "10.09.2023.",
          opis: "Vestibulum dapibus, mauris nec malesuada.",
          upiti: [
            {
              korisnik_id: 4,
              tekst_upita: "Maecenas tempus, tellus eget condimentum rhoncus."
            }
          ]
        }
      ];

    // Sample criteria
    

    // Initialize SpisakNekretnina
    const spisakNekretninaInstance = SpisakNekretnina();
    spisakNekretninaInstance.init(listaNekretnina, []);

    it('should filter nekretnine based on criteria1', function () {
        const kriterij = {
            tip_nekretnine: "Stan",
            max_cijena: 200000
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);


        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(0);

    });
    it('should filter nekretnine based on criteria2', function () {
        const kriterij = {
            tip_nekretnine: "Stan",
            max_cijena: 240000
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(1);
        chai.expect(filteredNekretnine[0]).to.have.property("naziv").that.equals("Useljiv stan Sarajevo");
        chai.expect(filteredNekretnine[0]).to.have.property("cijena").that.equals(232000);

    });
    it('should filter nekretnine based on criteria3', function () {
        const kriterij = {
            tip_nekretnine: "Stan",
            max_cijena: 240000,
            min_cijena: 250000
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(0);

    });

    it('should filter nekretnine based on criteria4', function () {
        const kriterij = {
            tip_nekretnine: "Poslovni prostor"
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(2);

    });

    it('should filter nekretnine based on criteria5', function () {
        const kriterij = {
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(4);

    });


    it('should filter nekretnine based on criteria6', function () {
        const kriterij = {
            pogresan:"nepotreban atribut"
        };
        const filteredNekretnine = spisakNekretninaInstance.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(4);

    });

    it('should filter nekretnine based on criteria7', function () {
        const spisakNekretninaInstance2 = SpisakNekretnina();
        spisakNekretninaInstance2.init(listaNekretnina, []);
        listaNekretnina=[]
        const kriterij = {
        };
        const filteredNekretnine = spisakNekretninaInstance2.filtrirajNekretnine(kriterij);

        chai.expect(filteredNekretnine).to.be.an('array');
        chai.expect(filteredNekretnine).to.have.lengthOf(4);

    });
});