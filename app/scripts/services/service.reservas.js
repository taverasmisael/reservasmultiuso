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

        function create(nuevaReservacion, nrProfesor, exception) {
            var $d = $q.defer();
            nuevaReservacion.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
            nuevaReservacion.status = 'active';
            nuevaReservacion.creator = Auth.user.profile.username;
            nuevaReservacion.creatorEmail = Auth.user.profile.email;
            nuevaReservacion.creatorFullName = Auth.user.profile.name + ' ' + Auth.user.profile.lastname;
            if (exception) {
                _disableReservations(nuevaReservacion.date, nuevaReservacion.starts, nuevaReservacion.ends)
                    .then(function() {
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
            console.log('Removing: ', id);
            findById(id).$loaded().then(function (reserv) {
              reserv.status = 'disabled';
              return reserv.$save();
            });
        }

        function isActive(reservacion) {
            return reservacion.status === 'active';
        }


        // Really Private Functions
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

        function _disableReservations(date, start, end) {
            var $d = $q.defer();
            Search.reservacion.byDate(date).then(function(reservas) {
                var filteredReservations = reservas.filter(function(res) {
                    return (start >= res.starts && start <= res.ends) || (start <= res.starts && end >= res.starts);
                });
                console.log(filteredReservations);
                for (var i = 0; i < filteredReservations.length; i += 1) {
                  remove(filteredReservations[i].$id);
                }

                $d.resolve(true);
            });

            return $d.promise;

        }

    }
})();
