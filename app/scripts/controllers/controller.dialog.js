class DialogController {
  constructor($mdDialog, currentUser, Auth, state) {
    this.$mdDialog = $mdDialog;
    this.currentUser = currentUser;
    this.Auth = Auth;

    this.heading = `${state.charAt(0).toUpperCase()} ${state.slice(1).toLowerCase()} usuario`;
    this.editing = state.toLowerCase() === 'editando';
    this.proccessStatus = '';

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
            this.proccessStatus = 'El correo electronico ya esta registrado';
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

DialogController.$inject = ['$mdDialog', 'currentUser', 'Auth', 'state'];

export default DialogController;
