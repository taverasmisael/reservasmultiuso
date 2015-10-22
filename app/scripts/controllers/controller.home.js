(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController () {
      var vm = this;
      vm.todayDate = new Date();
      vm.reservaciones = {};

      active();

      function active () {
        console.log('Active Main...');
        vm.reservaciones.today = [
          {
            who: 'SpiderMan',
            what: 'Seccion 0423',
            date: {
              starts: new Date(),
              ends: new Date()
            }
          },
          {
            who: 'Batman',
            what: 'Seccion 0325',
            date: {
              starts: new Date(),
              ends: new Date()
            }
          }
        ];
        vm.reservaciones.tomorrow = [
          {
            who: 'SuperMan',
            what: 'Seccion 0423',
            date: {
              starts: new Date(),
              ends: new Date()
            }
          },
          {
            who: 'IronMan',
            what: 'Seccion 0325',
            date: {
              starts: new Date(),
              ends: new Date()
            }
          }
        ];
      }
    }
})();
