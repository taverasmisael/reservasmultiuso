import {autobind} from 'core-decorators';

const firebaseObject = new WeakMap();
const firebaseArray = new WeakMap();
const RESERVREF = new WeakMap();
const PROFEREF = new WeakMap();

class Search {
  constructor($firebaseObject, $firebaseArray, Utilities, FURL) {
    let baseref = new Firebase(FURL);
    this.Utilities = Utilities;
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    RESERVREF.set(this, baseref.child('reservaciones'));
    PROFEREF.set(this, baseref.child('profesores'));
  }

  @autobind
  searchProfesorById(profesorId) {
    return firebaseObject.get(this)(PROFEREF.get(this).child(profesorId));
  }

  @autobind
  searchProfesorByCedula(cedula) {
    return firebaseObject.get(this)(PROFEREF.get(this)
          .orderByChild('cedula').equalTo(cedula)).$loaded();
  }

  @autobind
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

  @autobind
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

  @autobind
  searchReservacionById(reservacionId) {
    return firebaseObject.get(this)(RESERVREF.get(this).child(reservacionId));
  }

  @autobind
  searchReservacionByDate(date) {
    let fixedDate = this.Utilities.fixDate(date).valueOf();
    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('date').equalTo(fixedDate)).$loaded();
  }

  @autobind
  searchReservacionByPeriod(start, end) {
    let fixedStart = this.Utilities.fixDate(start).valueOf();
    let fixedEnd = this.Utilities.fixDate(end).valueOf();

    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('date').startAt(fixedStart).endAt(fixedEnd)).$loaded();
  }

  @autobind
  searchReservationsOf(profesorId) {
    return firebaseArray.get(this)(RESERVREF.get(this)
        .orderByChild('profesor').equalTo(profesorId)).$loaded();
  }

  @autobind
  checkAvailability(date, start, end) {
    let errMessage = {
      name: '',
      message: ''
    };
    start = this.Utilities.fixTime(date, start);
    end = this.Utilities.fixTime(date, end);

    let response = new Promise((resolve, reject) => {
      this.searchReservacionByDate(date)
        .then(reservas => {
          let filteredReservas = reservas.filter(res => {
            if (start.isSame(res.starts) || start.isBetween(res.starts, res.ends)) {
              errMessage.name = 'START_AT_SAME_TIME';
              errMessage.message = 'Both reservations has same or closer time';
              return true;
            } else if (start.isBefore(res.starts) && end.isAfter(res.starts)) {
              errMessage.name = 'ENDS_TOO_LATE';
              errMessage.message = 'Your reservation colides with other';
              return true;
            } else {
              return false;
            }
          });

          if (filteredReservas.length) {
            reject({
              data: filteredReservas,
              message: errMessage
            });
          } else {
            resolve({
              data: [],
              message: 'No colitions found'
            });
          }
        });
    });

    return response;
  }
}

Search.$inject = ['$firebaseObject', '$firebaseArray', 'Utilities', 'FURL'];

export default Search;
