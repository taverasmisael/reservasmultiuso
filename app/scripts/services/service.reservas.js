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
          var hoy = new Date(), d = $q.defer(), reservaciones = [];
          $firebaseArray(ref.child('reservaciones').orderByChild('datetime')).$loaded()
              .then(function (data) {
                angular.forEach(data, function (reserv) {
                  reserv.datetime.date === hoy.toDateString() ? reservaciones.push(reserv) : false;
                });
                console.log(reservaciones);
                d.resolve(reservaciones);
              }).catch(function (err) {
                d.reject(err);
              });

          return d.promise;
        }

        function findById (reservacionID) {
          return $firebaseObject(ref.child('reservaciones').child(reservacionID));
        }

        function create (nuevaReservacion) {
          nuevaReservacion.info = {};
          nuevaReservacion.info.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
          nuevaReservacion.info.status = 'active';
          //reservacion.creator = Auth.user.profile.username;
          return reservaciones.$add(nuevaReservacion);
        }

        function remove () {
          // Function for removing an especific REservation
        }

        function isActive (reservacion) {
          return reservacion.status === 'active';
        }

        // Funciones Privadas
        function _filterToday (reservaciones) {
          var d = $q.defer(), response = [];
          var hoy = new Date();
          hoy = hoy.toJSON();

          reservaciones.filter(function (reservacion) {
            console.log(reservacion.datetime.date);
            console.log(hoy);
            return reservacion.datetime.date === hoy;
          });
        }
    }
})();
