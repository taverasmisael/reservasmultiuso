class NavbarController {
  constructor($mdSidenav, Auth) {
    this.$mdSidenav = $mdSidenav;
    this.signedIn = Auth.signedIn;
    this.active();
  }

  active() {
    console.log('Navbaring...');
    $(document).on('click', (event)=> {
      if (!$(event.target).closest('.md-toolbar-tools .md-icon-button').length) {
        if(!$mdSidenav('left').isLockedOpen()){
          $mdSidenav('left').close();
        }
      }
    });
  }

  toggleSideBar() {
    this.$mdSidenav('left').toggle();
  }
}

NavbarController.$inject = ['$mdSidenav', 'Auth'];

export NavbarController;
