(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$mdDialog'];

    function SidebarController ($mdDialog) {
      var vm = this;

      vm.openMenu = openMenu;

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
    }
})();
