const dialogOptions = {
  controller: 'DialogController',
  controllerAs: 'DialogCtrl',
  templateUrl: 'views/dialogs/users.dlg.html',
  clickOutsideToClose: false,
  parent: angular.element(document.body)
};
class UsersController {
  constructor($mdMedia, $mdToast, $mdDialog, Auth, profiles) {
    this.$mdMedia = $mdMedia;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.profiles = profiles;

    this.tableOrder = 'name';

    this.active();
  }

  _dialogComplete(respuesta) {
    this.$mdToast.show(
      this.$mdToast.simple()
      .content(respuesta)
      .position('right bottom')
    );
  }

  _dialogAbort(err) {
    this.$mdToast.show(
      this.$mdToast.simple()
      .content(err)
      .position('right bottom')
    );
    console.error(err);
  }
  active() {
    console.log('Pie... What were you waiting for?');
    this.profiles = this.profiles;
  }

  editProfile(event, profileId) {
    this.Auth.getProfile(profileId).$loaded()
      .then(response => {
        let config = {
          event: event,
          locals: {
            currentUser: response,
            state: 'editando'
          }
        };
        let editDialog = $.extends(config, dialogOptions);

        this.$mdDialog.show(editDialog)
          .then(this._dialogComplete)
          .catch(this._dialogAbort);
      }).catch(err => console.error(err));
  }

  createUser(event) {
    let config = {
      event: event,
      locals: {
        currentUser: {},
        state: 'creando'
      }
    };
    let createDialog = $.extend(config, dialogOptions);

    this.$mdDialog.show(createDialog)
      .then(this._dialogComplete)
      .catch(this._dialogAbort);
  }

  deleteUser(event, uid) {
    let warning = {
      title: '¡Atención!',
      content: '¿Está seguro que desea elminar este usuario?',
      ariaLabel: 'Confirmar: Eliminar Usuario',
      targetEvent: event,
      ok: 'Estoy Seguro',
      cancel: 'No deseo eliminarlo'
    };
    let confirm = this.$mdDialog.confirm(warning);

    this.$mdDialog.show(confirm)
      .then(this.Auth.removeUser(uid))
      .then(this._dialogComplete('Usuario Eliminado'))
      .catch(err => console.error(err));
  }

  arrangeTable(order) {
    this.tableOrder = order;
  }
}

UsersController.$inject = ['$mdMedia', '$mdToast', '$mdDialog', 'Auth', 'profiles'];

export default UsersController;
