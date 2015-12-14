(function(){
    'use strict';
    angular.module('reservacionesMulti')
                .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$mdSidenav', 'Auth'];

    function NavbarController ($mdSidenav, Auth) {
      var vm = this;
      vm.signedIn = Auth.signedIn;

      vm.toggleSideBar = toggleSideBar;

      active();

      function active () {
        console.log('Navbaring...');
        $(document).on('click', function(event) {
          if (!$(event.target).closest('.md-toolbar-tools .md-icon-button').length) {
            if(!$mdSidenav('left').isLockedOpen()){
              $mdSidenav('left').close();
            }
          }
        });
      }

      // Public controller Functionality
      function toggleSideBar () {
        $mdSidenav('left').toggle();
      }
    }
})();
