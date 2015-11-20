(function(){
    'use strict';
    angular.module('mtTimeValidator', [])
            .constant('TIMEREGEXP', /^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/)
            .directive('mtTime', mtTime);


    function mtTime (TIMEREGEXP) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.mtTime = function(modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              // consider empty models to be valid
              return true;
            }

            if (TIMEREGEXP.test(viewValue)) {
              // it is valid
              return true;
            }

            // it is invalid
            return false;
          };
        }
      };
    }
})();
