(function() {
    'use strict';
    angular.module('mtCheckUserName', [])
        .directive('mtCheckUsername', mtCheckUsername);

    mtCheckUsername.$inject = ['$q', 'Auth'];

    function mtCheckUsername($q, Auth) {
        var directive = {
            link: linkFunc,
            require: 'ngModel',
            restrict: 'A',
            scope: true
        };

        return directive;

        function linkFunc(scope, el, attrs, ctrl) {
            ctrl.$asyncValidators.mtCheckUsername = function(modelValue, viewValue) {
                var $d = $q.defer();
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    $d.reject(false);
                }
                if (Boolean(parseInt(attrs.mtCheckUsername))) {
                    var username = viewValue;
                    Auth.usernameAvailable(username).then(function(response) {
                        $d.resolve(response);
                    }).catch(function(err) {
                        if (err.name === 'USERNAME_EXISTS') {
                            $d.reject('UserName Exists');
                        }
                    });
                } else {
                    $d.resolve(true);
                }

                return $d.promise;
            };
        }
    }
})();
