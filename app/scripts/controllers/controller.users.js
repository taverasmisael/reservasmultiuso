import {autobind} from 'core-decorators';
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

  @autobind
  active() {
    console.log('Pie... What were you waiting for?');
    this.profiles = this.profiles;
  }

  @autobind
  editProfile(event, profileId) {
    console.log('Editemos');
    this.Auth.getProfile(profileId).$loaded()
      .then(response => {
        let config = {
          event: event,
          locals: {
            currentUser: response,
            state: 'editando'
          }
        };
        let editDialog = $.extend(config, dialogOptions);
        console.log(config);
        this.$mdDialog.show(editDialog)
          .then(this._dialogComplete)
          .catch(this._dialogAbort);
      }).catch(err => console.error(err));
  }

  @autobind
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

  @autobind
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

  @autobind
  arrangeTable(order) {
    this.tableOrder = order;
  }

  @autobind
  _dialogComplete(respuesta) {
    this.$mdToast.show(
      this.$mdToast.simple()
      .content(respuesta)
      .position('right bottom')
    );
  }

  @autobind
  _dialogAbort(err) {
    this.$mdToast.show(
      this.$mdToast.simple()
      .content(err)
      .position('right bottom')
    );
    console.error(err);
  }
}

UsersController.$inject = ['$mdMedia', '$mdToast', '$mdDialog', 'Auth', 'profiles'];

export default UsersController;
