(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', 'Auth'];
    function AuthController ($scope, $state, Auth) {
        var vm = this;
        vm.logginUser = logginUser;
        active();

        function active () {
          console.log('Authoring...');
        }

        function logginUser (username, password) {
          var user = {
            username: username,
            password: password
          };

          Auth.login(user).then(function () {
            $state.go('home');
          }).catch(function (err) {
            console.log(err);
          });
        }
    }
})();
