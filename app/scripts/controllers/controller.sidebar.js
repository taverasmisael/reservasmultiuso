class SidebarController {
  constructor($state, $mdToast, Auth) {
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.Auth = Auth;

    this.user = {};
    this.isAdmin = Auth.isAdmin;
    this.options = [{
      displayName: 'Buscar',
      icon: 'search',
      state: 'search'
    }, {
      displayName: 'Lugares',
      icon: 'place',
      state: 'places'
    }, {
      displayName: 'Crear',
      icon: 'add',
      state: 'create'
    }, {
      displayName: 'Ayuda',
      icon: 'help',
      state: 'help'
    }];
    this.active();
  }

  active() {
    console.log('Sidebaring...');
    this.signedIn = this.Auth.signedIn;
    let checkProfile = setInterval(() => {
      this.user = this.Auth.user;
      if (this.user.profile) {
        clearInterval(checkProfile);
      }
    }, 500);
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

SidebarController.$inject = ['$state', '$mdToast', 'Auth'];

export default SidebarController;
