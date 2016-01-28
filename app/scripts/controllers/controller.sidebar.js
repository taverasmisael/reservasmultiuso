class SidebarController {
  constructor($scope, $state, $mdToast, Auth) {
    this.$scope = $scope;
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.Auth = Auth;

    this.user = {};
    this.isAdmin = Auth.isAdmin;
    this.options = [{
      displayName: 'Buscar',
      icon: 'search',
      restriction: true,
      state: 'search'
    }, {
      displayName: 'Lugares',
      icon: 'place',
      restriction: false,
      state: 'places'
    }, {
      displayName: 'Crear',
      icon: 'add',
      restriction: true,
      state: 'create'
    }, {
      displayName: 'Ayuda',
      icon: 'help',
      restriction: true,
      state: 'help'
    }];
    this.active();
  }

  active() {
    console.log('Sidebaring...');
    this.signedIn = this.Auth.signedIn;

    this.$scope.$watch(() => this.Auth.user, newval => {
      this.user = newval;
    });
  }

  openMenu($mdOpenMenu, event) {
    $mdOpenMenu(event);
  }

  logout() {
    this.Auth.logout();
    this.$mdToast.show(
      this.$mdToast.simple()
      .content('Has salido del Sistema')
      .position('right bottom')
    );
    this.$state.go('home');
  }
}

SidebarController.$inject = ['$scope', '$state', '$mdToast', 'Auth'];

export default SidebarController;
