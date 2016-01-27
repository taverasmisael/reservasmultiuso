import {autobind} from 'core-decorators';

class PlacesController {
  constructor($mdToast, Places) {
    this.Places = Places;
    this.$mdToast = $mdToast;
    this.editing = false;
    this.currentSaveIcon = 'edit';
    this.modeSaveMessage = 'Editar';
    this.currentCancelIcon = 'delete';
    this.currentPlace = {};
    this.active();
  }

  @autobind
  active() {
    console.log('Placing...');
    this.Places.all().then(lugares => {
      this.places = lugares;
    })
    .catch(console.error.bind(console));
  }

  @autobind
  addPlace(event) {
    console.log(event);
    this.currentSaveIcon = 'save';
    this.modeSaveMessage = 'Guardar';
    this.modeCancelMessage = 'Cancelar';
    this.editing = true;
    this.currentPlace = {};
  }

  @autobind
  changeMode() {
    if (this.editing) {
      // If is inactive
      this.currentSaveIcon = 'edit';
      this.modeSaveMessage = 'Editar';
      this.currentCancelIcon = 'delete';
      this.modeCancelMessage = 'Eliminar';
    } else {
      // If is active
      this.currentSaveIcon = 'save';
      this.modeSaveMessage = 'Guardar';
      this.currentCancelIcon = 'cancel';
      this.modeCancelMessage = 'Cancelar';
    }
    this.editing = !this.editing;
  }

  @autobind
  selectPlace(placeId) {
    this.Places.get(placeId)
      .then(place => this.currentPlace = place)
      .catch(console.error.bind(console));
  }

  @autobind
  savePlace(placeId, newData) {
    this.Places.edit(placeId, newData)
      .then(ref => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`Lugar ${ref.key} guardado`)
          .position('right bottom'));
      })
      .catch(console.error.bind(console));
  }

  @autobind
  deletePlace(placeId) {
    this.Places.remove(placeId)
      .then(() => {
        this.$mdToast.show(
          this.$mdToast.simple()
          .content(`${placeId} Elminado`)
          .position('right bottom'));
      })
      .catch(console.error.bind(console));
  }
}

PlacesController.$inject = ['$mdToast', 'Places'];

export default PlacesController;
