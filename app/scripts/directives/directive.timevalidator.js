(function(){
    'use strict';
    angular.module('mtTimeValidator', [])
            .constant('TIMEREGEXP', /^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/)
            .directive('time', time);


    function time (TIMEREGEXP) {
      return {
        require: 'ngModel',
        limit: 'A',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.time = function(modelValue, viewValue) {
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
