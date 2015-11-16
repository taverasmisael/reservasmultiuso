(function() {
  'use strict';

  angular
    .module('reservacionesMulti')
    .service('Search', Search);


  Search.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'FURL'];
  function Search($q, $firebaseObject, $firebaseArray, FURL) {

    var baseRef = new Firebase(FURL),
        reservRef = baseRef.child('reservaciones'),
        profeRef = baseRef.child('profesores');

    var SearchService = {
      profesor: {
        byId: pById,
        byCedula: pByCedula,
        sectionsOf: pSections
      },
      reservacion: {
        byId: rById,
        byDate: rByStartDate,
        byPeriod: rByPeriod,
        ofProfesor: rByProfesor
      }
    };

    return SearchService;

    /*
      **                           **
      * Querying Profesor Functions *
      **                           **
    */
    function pById (id) {
      return $firebaseArray(profeRef.child(id));
    }

    function pByCedula (cedula) {
      var $d = $q.defer();

      $firebaseArray(profeRef.orderByChild('cedula').equalTo(cedula))
          .$loaded().then(function (profesor) {
            $d.resolve(profesor);
          }).catch(function (err) {
            $d.reject(err);
          });

      return $d.promise;
    }

    function pSections (pName) {
      var $d = $q.defer();

      $firebaseArray(profeRef.orderByChild('nombre').equalTo(pName))
        .$loaded().then(function (profesor) {
          $d.resolve(profesor.secciones);
        }).catch(function (err) {
          $d.reject(err);
        });

      return $d.promise;
    }

    /*
      **                              **
      * Querying reservation Functions *
      **                              **
    */

    function rById (id) {
      return $firebaseArray(reservRef.child(id));
    }

    function rByStartDate (date) {
      var _date = new Date(date);
      var $d = $q.defer();

      $firebaseArray(reservRef.startAt('date').equalTo(_date.toLocaleDateString()))
        .$loaded().then(function (reserva) {
          $d.resolve(reserva);
        }).catch(function (err) {
          $d.reject(err);
        });

      return $d.promise;
    }

    function rByPeriod (period) {
      var $d = $q.defer();

      $firebaseArray(reservRef.orderByChild('period').equalTo(period))
        .$loaded().then(function (reservas) {
          $d.resolve(reservas);
        }).catch(function (err) {
          $d.reject(err);
        });

      return $d.promise;
    }

    function rByProfesor (profesorId) {
      var $d = $q.defer();

      $firebaseArray(reservRef.orderByChild('profesor').equalTo(profesorId))
        .$loaded().then(function (reservations) {
          $d.resolve(reservations);
        }).catch(function (err) {
          $d.reject(err);
        });

      return $d.promise;
    }
  }
}());
