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

    it("should add at least 2 divs",function(){
        let divR = document.getElementById("empty_div");
        spojiNekretnine(divR,spisakNekretninaInstance,"Stan");
        let dodaniDivovi=document.querySelectorAll("#empty_div div");
        chai.expect(dodaniDivovi).to.have.lengthOf.at.least(2);
        divR.innerHTML="";
    })
    it("should containt text 'Novi stan u Sarajevu' but not 'poslovni prostor'",function(){
        let divR = document.getElementById("empty_div");
        spojiNekretnine(divR,spisakNekretninaInstance,"Stan");
        chai.expect(divR.innerHTML).to.have.string("Novi stan u Sarajevu");
        chai.expect(divR.innerHTML).to.not.have.string("poslovni prostor");
        divR.innerHTML="";
    })
    it("two divs for 'Stan' and for 'Poslovni prostor'",function(){
        let divR = document.getElementById("empty_div");
        let divR2 = document.getElementById("empty_div2");
        spojiNekretnine(divR,spisakNekretninaInstance,"Stan");
        spojiNekretnine(divR2,spisakNekretninaInstance,"Poslovni prostor");
        chai.expect(divR.innerHTML).to.have.string("Novi stan u Sarajevu");
        chai.expect(divR.innerHTML).to.not.have.string("poslovni prostor");
        chai.expect(divR2.innerHTML).to.not.have.string("Novi stan u Sarajevu");
        chai.expect(divR2.innerHTML).to.have.string("poslovni prostor");
        divR.innerHTML="";
    })

});