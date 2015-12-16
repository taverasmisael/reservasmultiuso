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
          $d.resolve(false);
        }
        var profId = attr.profid;
        if (!profId || !viewValue) {
          $d.resolve(true);
        } else {
          Search.profesor.inMonth(profId, viewValue)
              .then(function (cant) {
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
