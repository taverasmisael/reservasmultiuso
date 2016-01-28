import {
  autobind
}
from 'core-decorators';

class PlacesController {
  constructor($mdToast, Places, Auth) {
    this.$mdToast = $mdToast;
    this.Places = Places;
    this.Auth = Auth;
    this.placeForm = {
      nombreDelLugar: {},
      capacidadDelLugar: {},
      ubicacionDelLugar: {}
    };
    this.active();
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
    this.currentPlace = {};
  }

  @autobind
  active() {
    console.log('Placing...');
    this.Places.all().then(lugares => {
      this.places = lugares;
    })
    .catch(console.error.bind(console));
    this.resetModes();
    let checkProfile = setInterval(() => {
      this.user = this.Auth.user;
      if (this.user.profile) {
        clearInterval(checkProfile);
      }
    }, 500);
  }

  @autobind
  addPlace(event) {
    console.log(event);
    this.currentSaveIcon = 'save';
    this.modeSaveMessage = 'Guardar';
    this.currentCancelIcon = 'cancel';
    this.modeCancelMessage = 'Cancelar';
    this.editing = true;
    this.creating = true;
    this.currentPlace = {};
  }

  @autobind
  changeMode() {
    if (this.creating) {
      // If is Saving/Inactive
      this.savePlace(this.currentPlace);
    } else if (!(this.editing && this.creating)) {
      if (this.editing) {
        this.editPlace(this.currentPlace.$id, this.currentPlace);
      }
      this.editing = !this.editing;
    }
  }

  @autobind
  savePlace(placeInfo) {
    this.Places.create(placeInfo)
      .then(ref => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`Lugar ${ref.key()} guardado`)
          .position('right bottom')
        );
        this.resetModes();
      })
      .catch(console.error.bind(console));
  }

  @autobind
  selectPlace(placeId) {
    console.info(placeId);
    this.Places.get(placeId)
      .then(place => this.currentPlace = place)
      .catch(console.error.bind(console));
  }

  @autobind
  editPlace(placeId, newData) {
    this.Places.edit(placeId, newData)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`Lugar ${newData.name} guardado`)
          .position('right bottom'));
      })
      .catch(console.error.bind(console));
  }

   @autobind
  cancelMode() {
    if (this.modeCancelMessage === 'Eliminar') {
      // If is Saving/Inactive
      this.deletePlace(this.currentPlace.$id);
    } else {
      // If is active
      this.resetModes();
    }
  }

  @autobind
  deletePlace(placeId) {
    this.Places.remove(placeId)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`${placeId} Elminado`)
          .position('right bottom')
        );
        this.resetModes();
      })
      .catch(console.error.bind(console));
  }
}

PlacesController.$inject = ['$mdToast', 'Places', 'Auth'];

export default PlacesController;
