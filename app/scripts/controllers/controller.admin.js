(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = ['$mdToast', '$filter', 'Utilities', 'Reservaciones', 'Search', 'Profesores'];
    function AdminController ($mdToast, $filter, Utilities, Reservaciones, Search, Profesores) {
        var vm = this;
        vm.createReservacion = createReservacion;
        vm.profesorsList = Profesores.all;
        vm.queryProfesors = queryProfesors;
        vm.fillSections = fillSections;
        vm.checkAvailability = checkAvailability;
        active();

        function active () {
          console.log('Administrating...');
          vm.today = new Date();
          _mdDatePickerFix();
          vm.newReservationData = {};
          vm.minReservationDate = new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate() - 1);
          $('#newReservationDataStarts').timepicker({ 'scrollDefault': 'now', 'minTime': '8:00am', 'maxTime': '8:00pm', 'forceRoundTime': true });
          // Watch Value Changed On StartsTime
          $('#newReservationDataStarts').on('changeTime', function () {
            var timeVal = $(this).val();
            $('#newReservationDataEnds').timepicker({ 'scrollDefault': timeVal, 'minTime': timeVal, 'maxTime': '8:00pm', 'forceRoundTime': true, 'showDuration': true });
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
          return seccion.id === vm.newReservationData.section;
         });
       }

        function fillSections () {
          if (vm.nrd) {
            vm.newReservationData.section = '';
            vm.availableSections = vm.nrd.profesor.secciones;
          }
        }

        function checkAvailability (date, start, end) {
          var _s =  $filter('amParse')(start, 'HH:mmA'),
              _e = $filter('amParse')(end, 'HH:mmA');
          Search.isAvailable(date, _s, _e).then(function (msg) {
            $mdToast.show($mdToast.simple().content(msg).position('right bottom'));
          }).catch(function (err) {
            vm.creationForm.$setValidity('onUse', false);
            $mdToast.show($mdToast.simple().content(err).position('right bottom'));
          });
        }

        function createReservacion (reservationData, nrdProfesor) {
          var newReservation = angular.copy(reservationData);
          // Changes time values
          console.log(reservationData.date);
          newReservation.date = Utilities.date.fix(reservationData.date).valueOf();
          newReservation.starts = $filter('amParse')(newReservation.starts, 'HH:mmA')._d.valueOf();
          newReservation.ends = $filter('amParse')(newReservation.ends, 'HH:mmA')._d.valueOf();
          newReservation.materia = _getSelectedSection()[0].materia;
          Reservaciones.create(newReservation, nrdProfesor)
                .then(function () {
                  // Calculates days until reservation day and display it on a beautiful toast
                  var fromNow = moment().to(newReservation.date);
                  $mdToast.show(
                    $mdToast.simple()
                    .content('Reservacion ' + fromNow)
                    .position('right bottom')
                  );
                  vm.newReservationData = {};
                  vm.selectedProfesor = '';
                }).catch(_errHdlr);
          }


        function _mdDatePickerFix () {
          var datePicker = $('md-datepicker'),
              datePickerInput = datePicker.find('input'),
              datePickerButton = datePicker.find('button');
          datePickerInput.on('focus', function (event) {
            event.preventDefault();
            datePickerButton.trigger('click');
          });
        }
        function _errHdlr (err) {
          console.error(err);
        }
    }
})();
