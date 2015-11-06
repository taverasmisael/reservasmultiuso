(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$mdToast', '$filter', 'Profesores'];
    function AdminController ($scope, $mdToast, $filter, Profesores) {
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
          // Watch Value Changed On StartsTime
          $('#newReservationDataStarts').on('changeTime', function () {
            $('#newReservationDataEnds').timepicker({ 'scrollDefault': $(this).val(), 'minTime': '8:00am', 'maxTime': '8:00pm', 'forceRoundTime': true });
          });
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

        function fillSections () {
          vm.availableSections = vm.newReservationData.profesor.secciones;
        }

        function createReservacion (reservationData) {
          var newReservation = angular.copy(reservationData);
          // Changes time values
          newReservation.time.starts = $filter('amParse')(newReservation.time.starts, 'HH:mmA')._d;
          newReservation.time.ends = $filter('amParse')(newReservation.time.ends, 'HH:mmA')._d;
          console.log(newReservation);

          // Calculates days until reservation day and display it
          // on a beautiful toast
          var fromNow = new moment().to(newReservation.date);
          $mdToast.show(
            $mdToast.simple()
            .content('Reservacion ' + fromNow)
            .position('right top')
          );
        }
    }
})();
