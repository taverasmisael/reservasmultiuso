import {
  autobind
}
from 'core-decorators';

const firebaseObject = new WeakMap(),
  firebaseArray = new WeakMap(),
  RESERVREF = new WeakMap(),
  PROFEREF = new WeakMap();

class Search {
  constructor($firebaseObject, $firebaseArray, Utilities, FURL) {
    let baseref = new Firebase(FURL);
    this.Utilities = Utilities;
    firebaseObject.set(this, $firebaeObject);
    firebaseArray.set(this, $firebaseArray);
    RESERVREF.set(this, baseref.child('reservaciones'));
    PROFEREF.set(this, baseref.child('profesores'))
  }

  @autobind
  searchProfesorById(profesorId) {
    return firebaseObject.get(this)(PROFEREF.get(this).child(id));
  }

  @autobind
  searchProfesorByCedula(cedula) {
    return firebaseObject.get(this)(PROFEREF.get(this).orderByChild('cedula').equalTo(cedula)).$loaded();
  }

  @autobind
  searchSectionsOf(profesorId) {
    let sections = new Promise((resolve, reject) => {
      this.searchProfesorById.$loaded().then((profesor) => {
        resolve(profesor.secciones);
      }).catch((err) => {
        reject(err);
      });
    });

    return sections;
  }

  @autobind
  searchProfesorInMonth(profesorId, date) {
    let start = Utilities.fixDate(moment(date).date(1)._d).valueOf(),
      end = Utilities.fixDate(moment(start).month(start.getMonth() + 1)._d).valueOf();

    let reservacionesEnMes = new Promise((resolve, reject) => {
      firebaseArray.get(this)(RESERVREF.get(this).orderByChild('date').startAt(start).endAt(end)).$loaded().then((data) => {
        let reservaciones = data.filter((r) => r.profesor == profesorId);
        resolve(reservaciones);
      }).catch((err) => {
        console.error(err);
        reject(err);
      })
    });

    return reservacionesEnMes;
  }

  @autobind
  searchReservacionById(reservacionId) {
    return firebaseObject.get(this)(RESERVREF.get(this).child(reservacionId));
  }

  @autobind
  searchReservacionByDate(date) {
    let fixedDate = Utilities.fixDate(date).valueOf();
    return firebaeArray.get(this)(RESERVREF.get(this).orderByChild('date').equalTo(fixedDate)).$loaded();
  }

  @autobind
  searchReservacionByPeriod(start, end) {
    let fixedStart = Utilities.fixDate(start).valueOf(),
      fixedEnd = Utilities.fixDate(end).valueOf();

    return firebaseArray.get(this)(RESERVREF.get(this).orderByChild('date').startAt(fixedStart).endAt(fixedEnd)).$loaded();
  }

  @autobind
  searchReservationsOf(profesorId) {
    return firebaseArray.get(this)(RESERVREF.get(this).orderByChild('profesor').equalTo(profesorId)).$loaded();
  }

  @autobind
  checkAvailability(date, start, end, place) {
    let errMessage = {
      name: '',
      message: ''
    };
    start = Utilities.fixTime(date, start);
    end = Utilities.fixTime(date, end);

    let response = new Promise((resolve, reject) => {
      this.searchReservacionByDate(date).then((reservas) => {
        let filteredReservas = reservas.filter((res) => {
          if (start.isSame(res.starts) || start.isBetween(res.starts, res.ends)) {
            errMessage.name = 'START_AT_SAME_TIME';
            errMessage.message = 'Both reservations has same or closer time';
            return true;
          } else if (start.isBefore(res.starts) && end.isAfter(res.starts)) {
            errMessage.name = 'ENDS_TOO_LATE';
            errMessage.message = 'The reservation you check colides with other';
            return true;
          } else {
            return false;
          }
        });

        if (filteredReservas) {
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
      })
    });

    return response;
  }
}

Search.$inject = ['$firebaseObject', '$firebaseArray', 'Utilities', 'FURL'];

export default Search;
