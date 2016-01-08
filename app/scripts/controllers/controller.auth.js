(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', 'Auth'];
    function AuthController ($scope, $state, Auth) {
        var vm = this;
        vm.logginUser = logginUser;
        vm.processStatus = '';
        active();

        function active () {
          console.log('Authoring...');
        }

        function logginUser (username, password) {
          var user = {
            username: username,
            password: password
          };

          Auth.login(user).then(()=> $state.go('home')).catch((err)=> vm.processStatus = err.message);
        }
    }
})();
