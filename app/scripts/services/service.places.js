import {autobind} from 'core-decorators';

const firebaseArray = new WeakMap();
const firebaseObject = new WeakMap();
const REF = new WeakMap();

class Places {
  constructor($firebaseArray, $firebaseObject, FURL) {
    let baseref = new Firebase(FURL);
    firebaseArray.set(this, $firebaseArray);
    firebaseObject.set(this, $firebaseObject);
    REF.set(this, baseref.child('places'));

    this.places = $firebaseArray(REF.get(this));
  }

  @autobind
  all() {
    return this.places.$loaded();
  }

  @autobind
  get(placeId) {
    return firebaseObject.get(this)(REF.get(this).child(placeId));
  }

  @autobind
  create(placeInfo) {
    return this.places.$add(placeInfo);
  }

  @autobind
  edit(placeId, newInfo) {
    let place = firebaseObject.get(this)(REF.get(this).child(placeId));
    let {capacity, location} = newInfo;
    // Set Exacts Values for our place
    place.capacity = capacity;
    place.location = location;

    return place.$save();
  }

  @autobind
  remove(placeId) {
    return firebaseObject.get(this)(REF.get(this).child(placeId)).$remove();
  }
}

Places.$inject = ['$firebaseArray', '$firebaseObject', 'FURL'];

export default Places;
