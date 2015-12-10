(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('UsersController', UsersController);

    UsersController.$inject = ['$mdMedia', '$mdToast', '$mdDialog', 'Auth', 'profiles'];
    function UsersController ($mdMedia, $mdToast, $mdDialog, Auth, profiles) {
        var vm = this;
        vm.editProfile = editProfile;

        active();

        function active () {
          vm.profiles = profiles;
        }

        function editProfile (event, id) {
          Auth.getProfile(id).$loaded().then(function (response) {
            $mdDialog.show({
                controller: 'DialogController',
                controllerAs: 'DialogCtrl',
                templateUrl: 'views/dialogs/users.dlg.html',
                targetEvent: event,
                clickOutsideToClose: false,
                locals: {
                    currentUser: response,
                    state: 'editando'
                },
                parent: angular.element(document.body)
            }).then(function(respuesta) {
                $mdToast.show(
                  $mdToast.simple()
                  .content(respuesta)
                  .position('right bottom')
                );
            }).catch(function(err) {
              $mdToast.show(
                $mdToast.simple()
                .content(err)
                .position('right bottom')
              );
                console.log(err);
            });
          }).catch(function (err) {
            console.log(err);
          });
        }
    }
})();
