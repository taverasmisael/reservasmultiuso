(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state', '$mdToast', 'Auth'];

    function SidebarController ($state, $mdToast, Auth) {
      var vm = this;
      vm.openMenu = openMenu;
      vm.logOut = logout;
      vm.user = {};
      vm.isAdmin = Auth.isAdmin;

      active();

      function active () {
        console.log('So Hello from the sidebar');
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
        vm.signedIn = Auth.signedIn;
        let checkProfile = setInterval(()=> {
          vm.user = Auth.user;
          if (vm.user.profile) {
            clearInterval(checkProfile);
          }
        }, 500);
      }

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
