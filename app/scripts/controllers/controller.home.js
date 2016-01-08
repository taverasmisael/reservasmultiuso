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

        Reservaciones.today().then((hoy)=> vm.reservaciones.today = hoy).catch((e)=>console.error(e));
        Reservaciones.getCommingSoon().then((soon)=>vm.reservaciones.commingSoon = soon).catch((e)=>console.error(e));
      }
    }
})();
