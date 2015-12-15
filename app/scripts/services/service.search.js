(function() {
  'use strict';

  angular
    .module('reservacionesMulti')
    .service('Search', Search);


  Search.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'Utilities', 'FURL'];
  function Search($q, $firebaseObject, $firebaseArray, Utilities, FURL) {

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
      },
      isAvailable: rAvailable
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
      var init = Utilities.date.fix(moment(date).date(1)._d);
      var finish = Utilities.date.fix(moment(init).month(init.getMonth() + 1)._d);

      init = init.valueOf();
      finish = finish.valueOf();

      console.log(init);
      console.log(finish);

      $firebaseArray(reservRef.orderByChild('date').startAt(init).endAt(finish))
            .$loaded().then(function (data) {
              $d.resolve(data.filter(function (reserv) {
                return reserv.profesor === id;
              }).length);
            }).catch(function (err) {
              console.error(err);
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

      $firebaseArray(reservRef.orderByChild('date').equalTo(Utilities.date.fix(date).valueOf()))
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

    function rAvailable (date, start, end) {
      var $d = $q.defer(),
          _s = new Date(start),
          _e = new Date(end);

      console.log('SendedStart: ', start);
      console.log('SendedEnd: ', end);

      var notAvailableError = {
        name: 'NOT_AVAILABLE',
        message: 'The Hours between'+ _s.toLocaleTimeString() + ' and ' + _e.toLocaleTimeString() + ' are already taken'
      };


      rByStartDate(date).then(function (reservas) {
        var filteredReservations = reservas.filter(function (res) {
          console.log(start, res.starts, res.ends);
          if (start >= res.starts && start <= res.ends) {
            $d.reject(notAvailableError);
          }
        });

        console.log(filteredReservations);
        if (!filteredReservations.length) {
          $d.resolve('Todo Bajo Control');
        } else {
          $d.reject(notAvailableError);
        }
      }).catch(function (err) {
        console.error(err);
        $d.reject(err);
      });

      return $d.promise;
    }

  }
}());
