import {
  autobind
}
from 'core-decorators';

@autobind
class UserDialogController {
  constructor($mdDialog, currentUser, Auth, state) {
    this.$mdDialog = $mdDialog;
    this.currentUser = currentUser;
    this.Auth = Auth;
    let State = `${state.charAt(0).toUpperCase()}${state.slice(1).toLowerCase()}`;
    this.heading = `${State} usuario`;
    this.editing = state.toLowerCase() === 'editando';
    this.processStatus = '';

    this.active();
  }

  active() {
    console.log('Dialoging...');
    this.selectedUser = this.currentUser;
  }

  saveUser(user2save) {
    let username = user2save.username;

    user2save.isAdmin = Boolean(parseInt(user2save.isAdmin, 10));
    if (this.editing) {
      this.Auth.updateProfile(user2save)
        .then(() => this.saveDialog(`${username} actualizado!`))
        .catch(err => console.error(err));
    } else {
      this.Auth.register(user2save)
        .then(() => this.saveDialog(`${username} creado con exito`))
        .catch(err => {
          console.error(err);
          if (err.code === 'EMAIL_TAKEN') {
            this.processStatus = 'El correo electronico ya esta registrado';
          }
        });
    }
  }

  cancelDialog(reason) {
    this.$mdDialog.cancel(reason);
  }

  saveDialog(reason) {
    this.$mdDialog.hide(reason);
  }
}

UserDialogController.$inject = ['$mdDialog', 'currentUser', 'Auth', 'state'];

export default UserDialogController;
