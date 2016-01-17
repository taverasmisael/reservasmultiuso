const dialogOptions = {
  controller: 'DialogController',
  controllerAs: 'DialogCtrl',
  templateUrl: 'views/dialogs/users.dlg.html',
  clickOutsideToClose: false,
  parent: angular.element(document.body)
};
class UserController {
  constructor($mdMedia, $mdToast, $mdDialog, Auth, profiles) {
    this.$mdMedia = $mdMedia;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.profiles = profiles;

    this.tableOrder = 'name';

    this.active();
  }

  active() {
    this.profiles = profiles;
  }

  editProfile(event, profileId) {
    this.Auth.getProfile(profileId).$loaded()
      .then((response) => {
        let config = {
          event: event,
          locals: {
            currentUser: response,
            state: 'editando'
          }
        };
        let editDialog = $.extends(config, dialogOptions);

        this.$mdDialog.show(editDialog)
          .then(_dialogComplete)
          .catch(_dialogAbort);
      }).catch((err) => console.error(err));
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
      .then(_dialogComplete)
      .catch(_dialogAbort);
  }

  deleteUser(event, uid) {
    let warning = {
      title: '¡Atención!',
      content: '¿Está seguro que desea elminar este usuario?',
      ariaLabel: 'Confirmar: Eliminar Usuario',
      targetEvent: event,
      ok: 'Estoy Seguro',
      cancel: 'No deseo eliminarlo'
    }
    let confirm = this.$mdDialog.confirm(warinig);

    this.$mdDialog.show(confirm)
      .then(this.Auth.removeUser(uid))
      .then(_dialogComplete('Usuario Eliminado'))
      .catch((err) => console.error(err));
  }

  arrangeTable(order) {
    this.tableOrder = order;
  }
}

UsersController.$inject = ['$mdMedia', '$mdToast', '$mdDialog', 'Auth', 'profiles'];

export UserController;

function _dialogComplete(respuesta) {
  $mdToast.show(
    $mdToast.simple()
    .content(respuesta)
    .position('right bottom')
  );
}

function _dialogAbort(err) {
  $mdToast.show(
    $mdToast.simple()
    .content(err)
    .position('right bottom')
  );
  console.error(err);
}
}
