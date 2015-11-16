(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SearchController', SearchController);

    SearchController.$inject = ['Profesores'];
    function SearchController (Profesores) {
        var vm = this;
        vm.queryProfesors = queryProfesors;
        vm.profesorsList = Profesores.all;
        active();

        function active () {
          console.log('Active Search....');
          vm.today = new Date();
        }

        function queryProfesors (profesorName) {
          console.log(profesorName);
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
    }
})();
