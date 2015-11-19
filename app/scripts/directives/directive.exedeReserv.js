(function() {
  'use strict';

  angular
    .module('mtExcedReservations', [])
    .directive('mtExcedReservations', mtExcedReservations);

  mtExcedReservations.$inject = ['$q', 'Search'];
  function mtExcedReservations($q, Search) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: linkFunc,
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
      ctrl.$asyncValidators.mtExcedReservations = function (modelValue, viewValue) {
        var $d = $q.defer();
        if(ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          $d.resolve(true);
        }
        var profId = attr.profid;
        if (!profId || !viewValue) {
          $d.reject(false);
        } else {
          Search.profesor.inMonth(profId, viewValue)
              .then(function (cant) {
                console.log(cant);
                if (cant >= 2) {
                  $d.reject(false);
                } else {
                  $d.resolve(true);
                }
              }).catch(_errHdl);
        }

        return $d.promise;
      };
    }

    function _errHdl (err) {
      console.error(err);
    }
  }
}());
