(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SearchController', SearchController);

    SearchController.$inject = ['Utilities', 'Profesores', 'Search'];
    function SearchController (Utilities, Profesores, Search) {
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
          _mdDatePickerFix();
          vm.today = new Date();
          vm.query = {
            message: 'Realiza una busqueda para poder ver los resultados'
          };
        }



        function searchByProfesor (profesor) {
          Search.reservacion.ofProfesor(profesor.$id).then(function (data) {
            vm.query.heading = profesor.name + ' ' + profesor.lastname;
            if (!data.length) {
              vm.query.message = 'No hay reservaciones para ' + vm.query.heading;
            } else {
              vm.query.message = '';
              vm.query.results = data;
            }

            vm.query.needsDate = true;
          }).catch(_errHndl);
        }

        function searchByDate (date) {
          Search.reservacion.byDate(date).then(function (data) {
            vm.query.heading = date.toLocaleDateString();

            if (!data.length) {
              vm.query.message = 'No hay reservaciones para ' + vm.query.heading;
            } else {
              vm.query.message = '';
              vm.query.results = data;
            }

            vm.query.needsDate = false;
          }).catch(_errHndl);
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

       function _mdDatePickerFix () {
         setTimeout(function () {
           var datePicker = $('.md-datepicker-input-container'),
               datePickerInput = datePicker.find('input'),
               datePickerButton = datePicker.find('button');
           datePickerInput.on('focus', function (event) {
             event.preventDefault();
             datePickerButton.trigger('click');
           });
         }, 250);
       }

       function _errHndl (err) {
         console.error(err);
       }
    }
})();
