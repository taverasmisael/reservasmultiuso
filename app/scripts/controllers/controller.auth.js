(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', 'Auth', 'profiles'];
    function AuthController ($scope, $state, Auth, profiles) {
        var vm = this;
        vm.logginUser = logginUser;
        active();

        function active () {
          console.log('Authoring...');
          vm.profiles = profiles;
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
