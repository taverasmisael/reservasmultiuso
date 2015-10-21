(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController () {
      active();

      function active () {
        console.log('Active Main...');
      }
    }
})();
