import {
  autobind
}
from 'core-decorators';

const REF = new WeakMap(),
  firebaseObject = new WeakMap(),
  firebaseArray = new WeakMap();

class Profesores {
  constructor($firebaseObject, $firebaseArray, FURL) {
    REF.set(this, new Firebase(FURL));
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    this.profesores = $firebaseArray(REF.get(this).child('profesores'));
  }

  @autobind
  all() {
    return this.profesores;
  }

  @autobind
  create(profesorData) {
    this.profesores.$add(profesorData);
  }

  @autobind
  getSections(pofesorID) {
    return firebaseObject.get(this)(REF.get(this).child('profesores').child(pofesorID).child('secciones'));
  }
}

Profesores.$inject = ['$firebaseObject', '$firebaseArray', 'FURL'];

export default Profesores;
