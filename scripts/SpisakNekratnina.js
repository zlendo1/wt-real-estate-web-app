let SpisakNekretnina = function () {
    let listaNekretnina = [];
    let listaKorisnika = [];

    let init = function (listaNekretnina, listaKorisnika) {
        this.listaNekretnina = listaNekretnina
        this.listaKorisnika = listaKorisnika
    }

    let filtrirajNekretnine = function (kriterij) {
        let newList = this.listaNekretnina

        let filterIfCriterion = function (criterionName, criterionLambda) {
            if (kriterij[criterionName] !== undefined) {
                newList = newList.filter(criterionLambda)
            }
        }

        filterIfCriterion('tip_nekretnine', obj => obj['tip_nekretnine'] === kriterij['tip_nekretnine'])
        filterIfCriterion('min_kvadratura', obj => obj['kvadratura'] >= kriterij['min_kvadratura'])
        filterIfCriterion('max_kvadratura', obj => obj['kvadratura'] <= kriterij['max_kvadratura'])
        filterIfCriterion('min_cijena', obj => obj['cijena'] >= kriterij['min_cijena'])
        filterIfCriterion('max_cijena', obj => obj['cijena'] <= kriterij['max_cijena'])

        return newList
    }

    let ucitajDetaljeNekretnine = function (id) {
        let result = listaNekretnina.find(obj => obj.id === id)

        return result !== undefined ? result : null
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};