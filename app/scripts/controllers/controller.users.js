(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('UsersController', UsersController);

    UsersController.$inject = ['$mdToast', 'profiles'];
    function UsersController ($mdToast, profiles) {
        var vm = this;
        vm.editProfile = editProfile;

        active();

        function active () {
          vm.profiles = profiles;
        }

        function editProfile (id) {
          $mdToast.show(
            $mdToast.simple()
            .content(id)
            .position('right bottom')
          );
        }
    }
})();
