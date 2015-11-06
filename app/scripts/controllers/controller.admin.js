(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['$mdToast', '$filter', 'Reservaciones', 'Profesores'];
    function AdminController ($mdToast, $filter, Reservaciones, Profesores) {
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
            var timeVal = $(this).val();
            $('#newReservationDataEnds').timepicker({ 'scrollDefault': timeVal, 'minTime': timeVal, 'maxTime': '8:00pm', 'forceRoundTime': true });
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

       function _getSelectedSection () {
         return vm.availableSections.filter(function (seccion) {
          return seccion.id === vm.newReservationData.meta.section;
         });
       }

        function fillSections () {
          if (vm.newReservationData.meta && vm.newReservationData.meta.profesor) {
            vm.newReservationData.meta.section = '';
            vm.availableSections = vm.newReservationData.meta.profesor.secciones;
          }
        }

        function createReservacion (reservationData) {
          var newReservation = angular.copy(reservationData);
          // Changes time values
          newReservation.datetime.date = reservationData.datetime.date.toJSON();
          newReservation.datetime.starts = $filter('amParse')(newReservation.datetime.starts, 'HH:mmA')._d.toJSON();
          newReservation.datetime.ends = $filter('amParse')(newReservation.datetime.ends, 'HH:mmA')._d.toJSON();
          newReservation.meta.materia = _getSelectedSection()[0].materia;
            Reservaciones.create(newReservation)
                  .then(function (data) {
                    // Calculates days until reservation day and display it on a beautiful toast
                    var fromNow = new moment().to(newReservation.datetime.date);
                    $mdToast.show(
                      $mdToast.simple()
                      .content('Reservacion ' + fromNow)
                      .position('right top')
                    );
                    vm.newReservationData = {};
                    vm.selectedProfesor = '';
                  }).catch(_errHdlr);
          }

        function _errHdlr (err) {
          console.error(err);
        }
    }
})();
