(function(){
    'use strict';
    angular.module('resrvacionesMulti')
            .controller('AuthController', AuthController);

    AuthController.$inject = ['Auth'];
    function AuthController (Auth) {
        var vm = this;

        active();

        function active () {
          console.log('Authoring...');
        }
    }
})();
