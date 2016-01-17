const REF = new WeakMap();
const firebaseObject = new WeakMap();
const firebaseArray = new WeakMap();

class Reservaciones {
  constructor($firebaseObject, $firebaseArray, Auth, Utilities, Search, FURL) {
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    this.Auth = Auth;
    this.Utilities = Utilities;
    this.Search = Search;
    REF.set(this, new Firebase(FURL));
    this.reservaciones = firebaseArray.get(this)(REF.get(this).child('reservaciones'));
    this.hoy = Utilities.fixDate(new Date());
    this.setReservationData = function(data) {
      data.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
      data.status = 'active';
      data.creator = Auth.user.profile.username;
      data.creatorEmail = Auth.user.profile.email;
      data.creatorFullName = Auth.user.profile.name + ' ' + Auth.user.profile.lastname;

      return data;
    };
    this.disableRange = function(date, start, end) {
      let promise = new Promise((resolve, reject) => {
        let disabledList = [];
        Search.reservacionByDate(date).then(reservas => {
          let filtered = reservas.filter(res => (start >= res.starts && start <= res.ends) || (start <= res.starts && end >= res.starts));
          for (let r of filtered) {
            disabledList.push(r.$id);
          }

          resolve(disabledList);
        }).catch(error => {
          reject(error);
          console.log(error);
        });
      });

      return promise;
    };

    this.makeReservation = function(data, profesor) {
      let promise = new Promise((resolve, reject) => {
        this.reservaciones.$add(data)
          .then(ref => {
            let key = ref.key();
            let reservacion = new Firebase(FURL + 'reservaciones/' + key);
            let newUpdate = {
              profesor: profesor.$id,
              profesorFullName: profesor.name + ' ' + profesor.lastname
            };
            reservacion.update(newUpdate);
            resolve(key);
          }).catch(err => {
            console.log(err);
            reject(err);
          });
      });

      return promise;
    };
  }

  all() {
    return this.reservaciones;
  }

  today() {
    return firebaseArray.get(this)(REF.get(this).child('reservaciones').orderByChild('date')
      .equalTo(this.hoy.valueOf())).$loaded();
  }

  getCommingSoon() {
    const tomorrow = moment(this.hoy).add(1, 'day')._d.valueOf();

    return firebaseArray.get(this)(REF.get(this).child('reservaciones').startAt(tomorrow)).$loaded();
  }

  findById(reservacionID) {
    return firebaseObject.get(this)(REF.get(this).child('reservaciones').child(reservacionID)).$loaded();
  }

  remove(reservacionID) {
    this.findById(reservacionID).then(reserv => {
      reserv.status = 'disabled';
      return reserv.$save;
    });
  }

  isActive(reservacion) {
    return reservacion.status === 'active';
  }

  create(reservacion, profesor) {
    let nuevaReservacion = this.setReservationData(reservacion);

    return this.makeReservation(nuevaReservacion, profesor);
  }

  createWithException(reservacion, profesor) {
    let nuevaReservacion = this.setReservationData(reservacion);
    let {
      date, starts, ends
    } = reservacion;

    this.disableRange(date, starts, ends)
      .then(disabledList => {
        nuevaReservacion.isException = true;
        nuevaReservacion.wereDisabled = disabledList;
        return this.makeReservation(nuevaReservacion, profesor);
      })
      .catch(e => console.error(e));
  }
}

Reservaciones.$inject = ['$firebaseObject', '$firebaseArray', 'Auth', 'Utilities', 'Search', 'FURL'];

export default Reservaciones;
