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
          icon: 'search'
        },
        {
          displayName: 'Crear',
          icon: 'add'
        },
        {
          displayName: 'Ayuda',
          icon: 'help'
        }
      ];

      function openMenu ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      };
    }
})();
