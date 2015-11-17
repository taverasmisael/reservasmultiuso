(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SearchController', SearchController);

    SearchController.$inject = ['Profesores', 'Search'];
    function SearchController (Profesores, Search) {
        var vm = this;
        vm.queryProfesors = queryProfesors;
        vm.profesorsList = Profesores.all;
        vm.search = {
          byProfesor: searchByProfesor,
          byDate: searchByDate
        };
        active();

        function active () {
          console.log('Active Search....');
          vm.today = new Date();
        }



        function searchByProfesor (profesor) {
          Search.reservacion.ofProfesor(profesor.$id).then(function (data) {
            vm.query.results = data;
            vm.query.currentProfesor = profesor.name + ' ' + profesor.lastname;
          }).catch(_errHndl);
        }

        function searchByDate (date) {
          console.log(date);
        }

        function queryProfesors (profesorName) {
          var response = profesorName ? vm.profesorsList.filter(createFilterFor(profesorName)) : vm.profesorsList;
          return response;
        }

        // Create filter function for a query string
       function createFilterFor(query) {
         var capitalcaseQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
         return function filterFn(profesor) {
          return (profesor.name.indexOf(capitalcaseQuery) === 0) || (profesor.lastname.indexOf(capitalcaseQuery) === 0);
         };
       }

       // Private Functions

       function _errHndl (err) {
         console.error(err);
       }
    }
})();
