(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$scope'];

    function SidebarController ($scope) {
      var vm = this;
      console.log($scope);
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
    }
})();
