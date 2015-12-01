(function(){
    'use strict';
    angular.module('reservacionesMulti')
                .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$mdSidenav', 'Auth'];

    function NavbarController ($mdSidenav, Auth) {
      var vm = this;
      vm.signedIn = Auth.signedIn;

      vm.showSidebar = showSidebar;


      // Public controller Functionality
      function showSidebar () {
        $mdSidenav('left').toggle();
      }
    }
})();
