(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .service('Reservaciones', Reservaciones);

    Reservaciones.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'Utilities', 'FURL'];

    function Reservaciones($q, $firebaseObject, $firebaseArray, Utilities, FURL) {
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

        function create(nuevaReservacion, nrProfesor) {
            var $d = $q.defer();

            nuevaReservacion.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
            nuevaReservacion.status = 'active';
            console.log(nuevaReservacion);
            //reservacion.creator = Auth.user.profile.username;

            reservaciones.$add(nuevaReservacion).then(function (ref) {
              var key = ref.key();
              var reservacion = new Firebase(FURL + 'reservaciones/' + key);
              var newUpdate = {
                profesor: nrProfesor.$id,
                profesorFullName: nrProfesor.name + ' ' + nrProfesor.lastname
              };

              console.log(reservacion);
              reservacion.update(newUpdate);
              $d.resolve(true);
            }).catch(function (err) {
              console.log(err);
              $d.reject(false);
            });

            return $d.promise;
        }

        function remove() {
            // Function for removing an especific REservation
        }

        function isActive(reservacion) {
            return reservacion.status === 'active';
        }

    }
})();
