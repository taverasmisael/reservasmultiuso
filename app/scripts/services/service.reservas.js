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
          // Function for Getting all Reservations, only for today
        }

        function findById () {
          // Function to find just one Reservation
        }

        function create () {
          // Function For Adding New Reservations
        }

        function remove () {
          // Function for removing an especific REservation
        }

        function isActive () {
          // Function for consulting if a Reservention is actually active
        }
    }
})();
