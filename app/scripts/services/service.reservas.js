(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .service('Reservaciones', Reservaciones);

    Reservaciones.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'Auth', 'Utilities', 'Search', 'FURL'];

    function Reservaciones($q, $firebaseObject, $firebaseArray, Auth, Utilities, Search, FURL) {
        var ref = new Firebase(FURL),
            reservaciones = $firebaseArray(ref.child('reservaciones')),
            _hoy = new Date();
        var hoy = Utilities.date.fix(_hoy);

        var ReservacionesService = {
            all: reservaciones,
            today: getToday,
            getCommingSoon: getCommingSoon,
            findById: findById,
            create: create,
            remove: remove,
            isActive: isActive
        };
        return ReservacionesService;

        /**
         * Function that retrurn todays Reservation
         * @return {Promise} A promise that is resolved with Today Reservations
         */
        function getToday() {
            var $d = $q.defer();

            $firebaseArray(ref.child('reservaciones').orderByChild('date')
                    .startAt(hoy.valueOf()).endAt(hoy.valueOf()))
                .$loaded().then(function(reservaciones) {
                    $d.resolve(reservaciones);
                }).catch(function(err) {
                    $d.reject(err);
                });

            return $d.promise;
        }

        /**
         * The function that return all reservations from tomorrow on
         * @return {Promise} A promise resolved with all reservations from tomorrow on
         */
        function getCommingSoon() {
            var $d = $q.defer(),
                tomorrow = moment(hoy).add(1, 'day')._d.valueOf();

            $firebaseArray(ref.child('reservaciones').orderByChild('date')
                .startAt(tomorrow)).$loaded().then(function(reservaciones) {
                $d.resolve(reservaciones);
            }).catch(function(err) {
                $d.reject(err);
            });

            return $d.promise;
        }

        function findById(reservacionID) {
            return $firebaseObject(ref.child('reservaciones').child(reservacionID));
        }

        /**
         * The Function that provides the Creation Functionality based on some conditions
         * @param  {Object} nuevaReservacion This contains the main information about the reservation
         * @param  {Object} nrProfesor       All information of the profesor that is applying
         * @param  {Boolean} exception        It tells if its an exception or not so it can procede
         * @return {Promis}                  The promise is resolved with a Boolean once all procedure is done.
         */
        function create(nuevaReservacion, nrProfesor, exception) {
            var $d = $q.defer();

            // Add serverInformation to the new reservation
            nuevaReservacion.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
            nuevaReservacion.status = 'active';
            nuevaReservacion.creator = Auth.user.profile.username;
            nuevaReservacion.creatorEmail = Auth.user.profile.email;
            nuevaReservacion.creatorFullName = Auth.user.profile.name + ' ' + Auth.user.profile.lastname;
            if (exception) {
                // if exception => we disable all reservation that may interfere with it and...
                _disableReservations(nuevaReservacion.date, nuevaReservacion.starts, nuevaReservacion.ends)
                    .then(function(dList) {
                        // ... then we say that its an exception and save the
                        // reserationsId that where Disabled for this could happen
                        nuevaReservacion.isException = true;
                        nuevaReservacion.wereDisabled = dList;
                        // And now, we can make our reservation
                        _makeReservation(nuevaReservacion, nrProfesor).then(function() {
                            $d.resolve(true);
                        }).catch(function(err) {
                            $d.reject(err);
                        });
                    }).catch(function(err) {
                        $d.reject(err);
                    });
            } else {
                _makeReservation(nuevaReservacion, nrProfesor).then(function() {
                    $d.resolve(true);
                }).catch(function(err) {
                    $d.reject(err);
                });
            }
            return $d.promise;
        }

        function remove(id) {
            findById(id).$loaded().then(function (reserv) {
              reserv.status = 'disabled';
              return reserv.$save();
            });
        }

        function isActive(reservacion) {
            return reservacion.status === 'active';
        }


        // Really Private Functions

        /**
         * Function who really add Reservation to DataBase
         * @param  {Object} data     The reservation itself with all data needed
         * @param  {Object} profesor All Profesor Information that for save the reservation
         * @return {Promise}          Promise Boolean Resolved once the reservation is done
         */
        function _makeReservation(data, profesor) {
            var $d = $q.defer();

            reservaciones.$add(data)
                .then(function(ref) {
                    var key = ref.key();
                    var reservacion = new Firebase(FURL + 'reservaciones/' + key);
                    var newUpdate = {
                        profesor: profesor.$id,
                        profesorFullName: profesor.name + ' ' + profesor.lastname
                    };
                    reservacion.update(newUpdate);
                    $d.resolve(true);
                }).catch(function(err) {
                    console.log(err);
                    $d.reject(false);
                });

            return $d.promise;
        }


        /**
         * Function for Masivily disable reservation in a range
         * @param  {Date} date  An date day where we'll look for disable on...
         * @param  {Date} start ... at this point (hour)...
         * @param  {Date} end   ... to this point (hour)
         * @return {Promise}       This promise will be resolve with disabeledIds
         */
        function _disableReservations(date, start, end) {
            var $d = $q.defer();
            var disabledList = [];
            Search.reservacion.byDate(date).then(function(reservas) {
                var filteredReservations = reservas.filter(function(res) {
                    return (start >= res.starts && start <= res.ends) || (start <= res.starts && end >= res.starts);
                });
                for (var i = 0; i < filteredReservations.length; i += 1) {
                  remove(filteredReservations[i].$id);
                  disabledList.push(filteredReservations[i].$id);
                }

                $d.resolve(disabledList);
            });

            return $d.promise;

        }

    }
})();
