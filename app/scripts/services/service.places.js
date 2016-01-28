import {autobind} from 'core-decorators';

const firebaseArray = new WeakMap();
const firebaseObject = new WeakMap();
const REF = new WeakMap();
const AUTH = new WeakMap();

class Places {
  constructor($firebaseArray, $firebaseObject, Auth, FURL) {
    let baseref = new Firebase(FURL);
    firebaseArray.set(this, $firebaseArray);
    firebaseObject.set(this, $firebaseObject);
    REF.set(this, baseref.child('places'));
    AUTH.set(this, Auth);

    this.places = $firebaseArray(REF.get(this));
  }

  @autobind
  all() {
    return this.places.$loaded();
  }

  @autobind
  get(placeId) {
    return firebaseObject.get(this)(REF.get(this).child(placeId)).$loaded();
  }

  @autobind
  create(placeInfo) {
    let {name, lastname} = AUTH.get(this).user.profile;
    placeInfo.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
    placeInfo.status = 'active';
    placeInfo.creator = AUTH.get(this).user.profile.username;
    placeInfo.creatorEmail = AUTH.get(this).user.profile.email;
    placeInfo.creatorFullName = `${name} ${lastname}`;
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

Places.$inject = ['$firebaseArray', '$firebaseObject', 'Auth', 'FURL'];

export default Places;
