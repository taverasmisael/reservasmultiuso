(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('HomeController', HomeController);

    HomeController.$inject = ['today', 'upcomming'];

    function HomeController (today, upcomming) {
      var vm = this;
      vm.todayDate = new Date();
      vm.reservaciones = {};

      active();

      function active () {
        console.log('Active Main...');
        vm.reservaciones.today = today;
        vm.reservaciones.commingSoon = upcomming;
      }
    }
})();
