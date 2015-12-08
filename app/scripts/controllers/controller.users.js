(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('UsersController', UsersController);

    UsersController.$inject = ['profiles'];
    function UsersController (profiles) {
        var vm = this;

        active();

        function active () {
          vm.profiles = profiles;
        }
    }
})();
