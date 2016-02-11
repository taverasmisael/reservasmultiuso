import {
  autobind
}
from 'core-decorators';

const REF = new WeakMap();
const firebaseObject = new WeakMap();
const firebaseArray = new WeakMap();

@autobind
class Profesores {
  constructor($firebaseObject, $firebaseArray, FURL) {
    REF.set(this, new Firebase(FURL));
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    this.profesores = $firebaseArray(REF.get(this).child('profesores'));
  }

  all() {
    return this.profesores;
  }

  create(profesorData) {
    return this.profesores.$add(profesorData);
  }

  getSections(pofesorID) {
    return firebaseArray.get(this)(REF.get(this).child('profesores')
      .child(pofesorID).child('secciones'));
  }

  get(profesorId) {
    return firebaseObject.get(this)(REF.get(this).child('profesores')
      .child(profesorId)).$loaded();
  }

  edit(profesorId, newData) {
    let profesor = REF.get(this).child('profesores').child(profesorId);
    let {
      cedula, lastname, name
    } = newData;
    let toSave = {
      name: name,
      lastname: lastname,
      cedula: cedula
    };

    return profesor.update(toSave);
  }

  remove(profesorId) {
    let profesor = firebaseObject.get(this)(REF.get(this)
      .child('profesores').child(profesorId));

    return profesor.$remove();
  }

  addSectionTo(profesorInfo, sectionInfo) {
    let {
      $id
    } = profesorInfo;
    let profesor = REF.get(this).child('profesores').child($id);
    let secciones = firebaseArray.get(this)(profesor.child('secciones'));

    return secciones.$add(sectionInfo);
  }
}

Profesores.$inject = ['$firebaseObject', '$firebaseArray', 'FURL'];

export default Profesores;
