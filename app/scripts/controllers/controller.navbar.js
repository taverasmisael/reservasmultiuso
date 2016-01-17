class NavbarController {
  constructor($mdSidenav, Auth) {
    this.$mdSidenav = $mdSidenav;
    this.signedIn = Auth.signedIn;
    this.active();
  }

  active() {
    const condition = '.md-toolbar-tools .md-icon-button';
    console.log('Navbaring...');
    $(document).on('click', event => {
      if (!$(event.target).closest(condition).length) {
        if (!this.$mdSidenav('left').isLockedOpen()) {
          this.$mdSidenav('left').close();
        }
      }
    });
  }

  toggleSideBar() {
    this.$mdSidenav('left').toggle();
  }
}

NavbarController.$inject = ['$mdSidenav', 'Auth'];

export default NavbarController;
