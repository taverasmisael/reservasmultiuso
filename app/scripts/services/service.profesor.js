import {autobind} from 'core-decorators';

const REF = new WeakMap();
const firebaseObject = new WeakMap();
const firebaseArray = new WeakMap();

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
    return this.profesores.$add(profesorData);
  }

  @autobind
  getSections(pofesorID) {
    return firebaseArray.get(this)(REF.get(this).child('profesores')
      .child(pofesorID).child('secciones'));
  }

  @autobind
  get(profesorId) {
    return firebaseObject.get(this)(REF.get(this).child('profesores')
            .child(profesorId)).$loaded();
  }

  @autobind
  edit(profesorId, newData) {
    let profesor = REF.get(this).child('profesores').child(profesorId);
    let {cedula, lastname, name} = newData;
    let toSave = {
      name: name,
      lastname: lastname,
      cedula: cedula
    };

    return profesor.update(toSave);
  }

  @autobind
  remove(profesorId) {
    let profesor = firebaseObject.get(this)(REF.get(this)
                .child('profesores').child(profesorId));

    return profesor.$remove();
  }

  @autobind
  addSectionTo(profesorInfo, sectionInfo) {
    let {$id} = profesorInfo;
    let profesor = REF.get(this).child('profesores').child($id);
    let secciones = firebaseArray.get(this)(profesor.child('secciones'));

    return secciones.$add(sectionInfo);
  }
}

Profesores.$inject = ['$firebaseObject', '$firebaseArray', 'FURL'];

export default Profesores;
