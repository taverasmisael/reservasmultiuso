(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .service('Profesores', Profesores);

    Profesores.$inject = ['$q', '$firebaseObject', '$firebaseArray', 'FURL'];
    function Profesores ($q, $firebaseObject, $firebaseArray, FURL) {
        var ref = new Firebase(FURL),
            profesores = $firebaseArray(ref.child('profesores'));

        var ProfesoresService = {
          all: profesores,
          create: create,
          getSecciones: getProfesorSections
        };

        return ProfesoresService;

        function create (ProfesorData) {
          return profesores.$add(ProfesorData);
        }

        function getProfesorSections (ProfesorID) {
          return $firebaseObject(ref.child('profesores').child(ProfesorID).child('secciones'));
        }
    }
})();
