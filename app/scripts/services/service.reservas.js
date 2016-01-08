'use strict';

class Reservaciones {
    constructor($firebaseObject, $firebaseArray, Auth, Utilities, Search, FURL) {
      console.log(FURL);
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;
        this.Auth = Auth;
        this.Utilities = Utilities;
        this.Search = Search;
        this.FURL = FURL;
        this.ref = new Firebase(FURL);
        this.reservaciones = $firebaseArray(this.ref.child('reservaciones'));
        this.hoy = Utilities.date.fix(new Date());
        this.setReservationData = function(data) {
            data.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
            data.status = 'active';
            data.creator = Auth.user.profile.username;
            data.creatorEmail = Auth.user.profile.email;
            data.creatorFullName = Auth.user.profile.name + ' ' + Auth.user.profile.lastname;

            return data;
        };
        this.disableRange = function(date, start, end) {
            let promise;

            function disableRangePromise(resolve, reject) {
                let disabledList = [];
                Search.reservacionByDate(date).then((reservas) => {
                    let filtered = reservas.filter((res) => (start >= res.starts && start <= res.ends) || (start <= res.starts && end >= res.starts));
                    for (let r of filtered) {
                        disabledList.push(r.$id);
                    }

                    resolve(disabledList);
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
            }
            promise = new Promise(disableRangePromise);
            return promise;
        };

        this.makeReservation = function(data, profesor) {
            let promise;
            let _this = this;

            function makeReservationPromise(resolve, reject) {
                _this.reservaciones.$add(data)
                    .then((ref) => {
                        let key = ref.key();
                        let reservacion = new Firebase(FURL + 'reservaciones/' + key);
                        let newUpdate = {
                            profesor: profesor.$id,
                            profesorFullName: profesor.name + ' ' + profesor.lastname
                        };
                        reservacion.update(newUpdate);
                        resolve(key);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            }

            promise = new Promise(makeReservationPromise);

            return promise;
        };
    }
    all() {
        return this.reservaciones;
    }
    today() {
        return this.$firebaseArray(this.ref.child('reservaciones').orderByChuld('date')
            .equalTo(this.hoy)).$loaded();
    }
    getCommingSoon() {
        const tomorrow = moment(this.hoy).add(1, 'day')._d.valueOf();

        return this.$firebaseArray(this.ref.child('reservaciones').startAt(tomorrow)).$loaded();
    }
    findById(reservacionID) {
        return this.$firebaseObject(this.ref.child('reservaciones').child(reservacionID)).$loaded();
    }
    remove(reservacionID) {
        this.findById(reservacionID).then((reserv) => {
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
        let { date, starts, ends } = reservacion;

        this.disableRange(date, starts, ends).then((disabledList) => {
            nuevaReservacion.isException = true;
            nuevaReservacion.wereDisabled = disabledList;
            return this.makeReservation(nuevaReservacion, profesor);
        }).catch(console.bind(console));
    }
}

Reservaciones.$inject = ['$firebaseObject', '$firebaseArray', 'Auth', 'Utilities', 'Search', 'FURL'];

angular.module('reservacionesMulti')
      .service('Reservaciones', Reservaciones);

//export default Reservaciones;
