(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('HomeController', HomeController);

    HomeController.$inject = ['Reservaciones'];

    function HomeController (Reservaciones) {
      var vm = this;
      vm.todayDate = new Date();
      vm.reservaciones = {};

      active();

      function active () {
        console.log('Active Main...');
        Reservaciones.today().then(function (reservaciones) {
          vm.reservaciones.today = reservaciones;
        });
        Reservaciones.getCommingSoon().then(function (reservaciones) {
          vm.reservaciones.commingSoon = reservaciones;
        });
      }
    }
})();
