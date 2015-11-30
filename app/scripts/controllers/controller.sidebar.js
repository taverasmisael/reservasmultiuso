(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state', 'Auth'];

    function SidebarController ($state, Auth) {
      var vm = this;

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
        $state.go('home');
      }
    }
})();
