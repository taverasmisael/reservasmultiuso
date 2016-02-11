import {autobind} from 'core-decorators';

const firebaseObject = new WeakMap();
const firebaseArray = new WeakMap();
const RESERVREF = new WeakMap();
const PROFEREF = new WeakMap();

@autobind
class Search {
  constructor($firebaseObject, $firebaseArray, Utilities, FURL) {
    let baseref = new Firebase(FURL);
    this.Utilities = Utilities;
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    RESERVREF.set(this, baseref.child('reservaciones'));
    PROFEREF.set(this, baseref.child('profesores'));
  }

  searchProfesorById(profesorId) {
    return firebaseObject.get(this)(PROFEREF.get(this).child(profesorId));
  }

  searchProfesorByCedula(cedula) {
    return firebaseObject.get(this)(PROFEREF.get(this)
          .orderByChild('cedula').equalTo(cedula)).$loaded();
  }

  searchSectionsOf(profesorId) {
    let sections = new Promise((resolve, reject) => {
      this.searchProfesorById(profesorId).$loaded()
        .then(profesor => {
          resolve(profesor.secciones);
        }).catch(err => {
          reject(err);
        });
    });

    return sections;
  }

  searchProfesorInMonth(profesorId, date) {
    let start = this.Utilities.fixDate(moment(date).date(1)._d);
    let nextMes = start.month() + 1;
    let end = this.Utilities.fixDate(moment(start).month(nextMes)._d).valueOf();
    // Use the ValueOf the Date
    start = start.valueOf();

    let reservacionesEnMes = new Promise((resolve, reject) => {
      firebaseArray.get(this)(RESERVREF.get(this).orderByChild('date')
        .startAt(start).endAt(end))
        .$loaded()
        .then(data => {
          let reservaciones = data.filter(r => r.profesor === profesorId);
          resolve(reservaciones);
        }).catch(err => {
          console.error(err);
          reject(err);
        });
    });

    return reservacionesEnMes;
  }

  searchReservacionById(reservacionId) {
    return firebaseObject.get(this)(RESERVREF.get(this).child(reservacionId));
  }

  searchReservacionByDate(date) {
    let fixedDate = this.Utilities.fixDate(date).valueOf();
    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('date').equalTo(fixedDate)).$loaded();
  }

  searchReservacionByPeriod(start, end) {
    let fixedStart = this.Utilities.fixDate(start).valueOf();
    let fixedEnd = this.Utilities.fixDate(end).valueOf();

    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('date').startAt(fixedStart).endAt(fixedEnd)).$loaded();
  }

  searchReservationsOf(profesorId) {
    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('profesor').equalTo(profesorId)).$loaded();
  }

  searchReservacionByPlace(placeId) {
    return firebaseArray.get(this)(RESERVREF.get(this)
          .orderByChild('place').equalTo(placeId)).$loaded();
  }
}

Search.$inject = ['$firebaseObject', '$firebaseArray', 'Utilities', 'FURL'];

export default Search;
