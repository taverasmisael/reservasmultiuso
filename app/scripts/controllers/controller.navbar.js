(function(){
    'use strict';
    angular.module('reservacionesMulti')
                .controller('NavbarController', NavbarController);

    NavbarController.$inject = [ '$mdSidenav' ];

    function NavbarController ($mdSidenav) {
      var vm = this;

      vm.showSidebar = showSidebar;


      // Public controller Functionality
      function showSidebar () {
        $mdSidenav('left').toggle();
      }
    }
})();
