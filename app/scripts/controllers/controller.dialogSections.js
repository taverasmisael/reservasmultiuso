import {
  autobind
}
from 'core-decorators';

@autobind
class SectionsDialogController {
  constructor($mdToast, $mdDialog, Auth, Profesores, profesor, secciones) {
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.Profesores = Profesores;
    this.profesorInfo = profesor;
    this.secciones = secciones;

    this.tableOrder = 'materia';
    this.creatingNew = false;
    this.modeMessage = 'Agregar';

    this.active();
  }

  active() {
    console.log('Administrating sections...');
  }

  creationMode() {
    if (this.creatingNew) {
      this.creatingNew = false;
      this.modeMessage = 'Agregar';
    } else {
      this.creatingNew = true;
      this.modeMessage = 'Ocultar';
    }
  }

  cancelDialog(reason) {
    this.$mdDialog.cancel(reason);
  }

  saveDialog(reason) {
    this.$mdDialog.hide(reason);
  }

  addSection(sectionInfo) {
    this.Profesores.addSectionTo(this.profesorInfo, sectionInfo)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`${sectionInfo.materia} Agregada`)
          .position('right bottom')
        );
        this.newSection = {};
        this.creationMode();
      })
      .catch(console.error.bind(console));
  }

  arrangeTable(order) {
    this.tableOrder = order;
  }

}

SectionsDialogController.$inject = ['$mdToast', '$mdDialog',
  'Auth', 'Profesores', 'profesor', 'secciones'
];

export default SectionsDialogController;
