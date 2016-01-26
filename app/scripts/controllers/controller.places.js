import {autobind} from 'core-decorators';

class PlacesController {
  constructor($mdToast Places) {
    this.Places = Places;
    this.$mdToast = $mdToast;
    this.active();
    this.editing = false;
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
          .content(`${this.currentPlace.name} Elminado`)
          .position('right bottom'));
      })
      .catch(console.error.bind(console));
  }
}

PlacesController.$inject = ['$mdToast', 'Places'];

export default PlacesController;
