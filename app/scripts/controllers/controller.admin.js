(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['Profesores', '$filter'];
    function AdminController (Profesores, $filter) {
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
          $('#newReservationDataStarts').timepicker({ 'scrollDefault': 'now', 'minTime': '8:00am', 'maxTime': '8:00pm', 'forceRoundTime': true });
          $('#newReservationDataEnds').timepicker({ 'scrollDefault': $('#newReservationDataStarts').val(), 'minTime': '8:00am', 'maxTime': '8:00pm', 'forceRoundTime': true });
        }

        function queryProfesors (profesorName) {
          console.log(profesorName, 'Query 22');
          var response = profesorName ? vm.profesorsList.filter(createFilterFor(profesorName)) : vm.profesorsList;
          console.log(response);
          return response;
        }

        // * Create filter function for a query string
       function createFilterFor(query) {
         var capitalcaseQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
         console.log(capitalcaseQuery, 'Query 31');
         return function filterFn(profesor) {
          console.log(profesor, 'Query 33');
          return (profesor.name.indexOf(capitalcaseQuery) === 0) || (profesor.lastname.indexOf(capitalcaseQuery) === 0);
         };
       }

        function fillSections () {
          vm.availableSections = vm.newReservationData.profesor.secciones;
        }

        function createReservacion (reservationData) {
          var newReservation = angular.copy(reservationData);
          // Changes time values
          newReservation.time.starts = $filter('amParse')(newReservation.time.starts, 'HH:mmA')._d;
          newReservation.time.ends = $filter('amParse')(newReservation.time.ends, 'HH:mmA')._d;
          console.log(newReservation);
        }
    }
})();
