(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state', '$mdToast', 'Auth'];

    function SidebarController ($state, $mdToast, Auth) {
      var vm = this;
      vm.signedIn = Auth.signedIn;
    vm.user = Auth.user.profile;

      vm.openMenu = openMenu;
      vm.logOut = logout;

      vm.options = [
        {
          displayName: 'Buscar',
          icon: 'search',
          state: 'search'
        },
        {
          displayName: 'Crear',
          icon: 'add',
          state: 'create'
        },
        {
          displayName: 'Ayuda',
          icon: 'help',
          state: 'help'
        }
      ];

      function openMenu ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      }

      function logout () {
        Auth.logout();
        $mdToast.show(
          $mdToast.simple()
          .content('Has salido del Sistema')
          .position('right bottom')
        );
        $state.go('home');
      }
    }
})();
