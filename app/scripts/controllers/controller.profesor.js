import {
  autobind
}
from 'core-decorators';

class ProfesorsController {
  constructor($mdToast, Profesores, Auth) {
    this.$mdToast = $mdToast;
    this.Profesores = Profesores;
    this.Auth = Auth;

    this.active();
    this.profesors = Profesores.all();
    console.info(Profesores);
  }

  active() {
    console.log('Teaching');
    this.resetModes();
  }

  @autobind
  resetModes() {
    console.info('Reseting Modes...');
    this.editing = false;
    this.creating = false;
    this.currentSaveIcon = 'edit';
    this.modeSaveMessage = 'Editar';
    this.modeCancelMessage = 'Eliminar';
    this.currentCancelIcon = 'delete';
    this.currentProfesor = undefined;
  }

   @autobind
  changeMode() {
    if (this.creating) {
      // If is Saving/Inactive
      this.savePlace(this.currentProfesor);
    } else if (!(this.editing && this.creating)) {
      if (this.editing) {
        this.editProfesor(this.currentProfesor.$id, this.currentProfesor);
      }
      this.editing = !this.editing;
      this.modeCancelMessage = 'Cancelar edicion de';
      this.currentCancelIcon = 'cancel';
      this.currentSaveIcon = 'save';
      this.modeSaveMessage = 'Guardar';
    }
  }

  @autobind
  addProfesor(event) {
    console.log(event);
    this.currentSaveIcon = 'save';
    this.modeSaveMessage = 'Guardar';
    this.currentCancelIcon = 'cancel';
    this.modeCancelMessage = 'Cancelar edicion de';
    this.editing = true;
    this.creating = true;
    this.currentProfesor = {};
  }

  @autobind
  selectProfesor(profesorId) {
    console.info(profesorId);
    this.Profesores.get(profesorId)
      .then(profesor => this.currentProfesor = profesor)
      .catch(console.error.bind(console));
  }
  @autobind
  cancelMode() {
    if (this.modeCancelMessage === 'Eliminar') {
      // If is Saving/Inactive
      this.deletePlace(this.currentProfesor.$id);
    } else {
      // If is active
      this.resetModes();
    }
  }
}

ProfesorsController.$inject = ['$mdToast', 'Profesores', 'Auth'];

export default ProfesorsController;
