(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['Profesores'];
    function AdminController (Profesores) {
        var vm = this;
        vm.createReservacion = createReservacion;
        vm.profesorsList = Profesores.all;
        vm.queryProfesors = queryProfesors;
        vm.fillSections = fillSections;
        active();

        function active () {
          console.log('Administrating...');
          vm.today = new Date();
          console.log(vm.profesorsList);
          vm.minReservationDate = new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate() - 1);
        }

        function queryProfesors (profesorName) {
          console.log(profesorName, 'Query 22');
          var response = profesorName ? vm.profesorsList.filter(createFilterFor(profesorName)) : vm.profesorsList;
          console.log(response);
          return response;
        }

        // * Create filter function for a query string
       function createFilterFor(query) {
         var lowercaseQuery = angular.lowercase(query);
         console.log(lowercaseQuery, 'Query 31');
         return function filterFn(profesor) {
          console.log(profesor, 'Query 33');
          return (profesor.name.indexOf(query) === 0) || (profesor.lastname.indexOf(query) === 0);
         };
       }

        function fillSections () {
          vm.availableSections = vm.newReservationData.profesor.secciones || [{id: 0, materia: 'Selecciona un profesor'}];
        }

        function createReservacion (reservationData) {
          console.log(reservationData);
        }
    }
})();
