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
        sectionsOf: pSections,
        inMonth: pInMonth
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

    function pInMonth (id, date) {
      var $d = $q.defer();
      var lds = date.toLocaleDateString().split('/'),
      initDate, finishDate;

      lds[0] = 1;
      initDate = lds.join('/');
      if (lds[1] === 12) {
        finishDate = '1/1/' + parseInt(lds[2])+1;
      } else {
        finishDate = '1/' + (parseInt(lds[1])+ 1) + '/' + lds[2] ;
      }

      $firebaseArray(reservRef.orderByChild('date').startAt(initDate).endAt(finishDate))
                .$loaded().then(function (data) {
                  $d.resolve(data.filter(function (reserv) {
                      console.log(reserv);
                      return reserv.profesor === id;
                    }).length
                  );
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
      var $d = $q.defer();

      $firebaseArray(reservRef.orderByChild('date').equalTo(date.toLocaleDateString()))
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
