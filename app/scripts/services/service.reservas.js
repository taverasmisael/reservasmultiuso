(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .service('Reservaciones', Reservaciones);

    Reservaciones.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'FURL'];
    function Reservaciones ($q, $firebaseObject, $firebaseArray, FURL) {
      var ref = new Firebase(FURL),
          reservaciones = $firebaseArray(ref.child('reservaciones'));
        var ReservacionesService = {
          all: reservaciones,
          today: getToday,
          findById: findById,
          create: create,
          remove: remove,
          isActive: isActive
        };
        return ReservacionesService;

        function getToday () {
          var hoy = new Date(), d = $q.defer();
          $firebaseArray(ref.child('reservaciones').orderByChild('fecha')
            .equalTo(hoy.toDateString())).$loaded()
              .then(function (data) {
                d.resolve(data);
              }).catch(function (err) {
                d.reject(err);
              });

          return d.promise;
        }

        function findById (reservacionID) {
          return $firebaseObject(ref.child('reservaciones').child(reservacionID));
        }

        function create (nuevaReservacion) {
          nuevaReservacion.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
          nuevaReservacion.status = 'active';
          //reservacion.creator = Auth.user.profile.username;
          return reservaciones.$add(nuevaReservacion);
        }

        function remove () {
          // Function for removing an especific REservation
        }

        function isActive (reservacion) {
          return reservacion.status === 'active';
        }
    }
})();
