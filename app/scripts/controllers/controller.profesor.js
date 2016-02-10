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
      this.saveProfesor(this.currentProfesor);
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
    this.Profesores.get(profesorId)
      .then(profesor => this.currentProfesor = profesor)
      .catch(console.error.bind(console));
  }
  @autobind
  cancelMode() {
    if (this.modeCancelMessage === 'Eliminar') {
      // If is Saving/Inactive
      this.deleteProfesor(this.currentProfesor.$id);
    } else {
      // If is active
      this.resetModes();
    }
  }

  @autobind
  editProfesor(pid, pinfo) {
    this.Profesores.edit(pid, pinfo)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`Profesor ${pinfo.name} editado`)
          .position('right bottom'));
      })
      .catch(console.error.bind(console));
  }

  @autobind
  saveProfesor(pinfo) {
    this.Profesores.create(pinfo)
      .then(ref => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`Profesor ${ref.key()} creado`)
          .position('right bottom')
        );
        this.resetModes();
      })
      .catch(console.error.bind(console));
  }

  @autobind
  deleteProfesor(pid) {
    this.Profesores.remove(pid)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`${pid} Elminado`)
          .position('right bottom')
        );
        this.resetModes();
      })
      .catch(console.error.bind(console));
  }
}

ProfesorsController.$inject = ['$mdToast', 'Profesores', 'Auth'];

export default ProfesorsController;
