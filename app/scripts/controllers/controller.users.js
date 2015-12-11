(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$mdMedia', '$mdToast', '$mdDialog', 'Auth', 'profiles'];

    function UsersController($mdMedia, $mdToast, $mdDialog, Auth, profiles) {
        var vm = this;
        var dialogOptions = {
            controller: 'DialogController',
            controllerAs: 'DialogCtrl',
            templateUrl: 'views/dialogs/users.dlg.html',
            clickOutsideToClose: false,
            parent: angular.element(document.body)
        };
        vm.editProfile = editProfile;
        vm.createUser = createUser;

        active();

        function active() {
            vm.profiles = profiles;
        }

        function editProfile(event, id) {
            Auth.getProfile(id).$loaded().then(function(response) {
                var editDialog = $.extend({}, dialogOptions);
                editDialog.event = event;
                editDialog.locals = {
                    currentUser: response,
                    state: 'editando'
                };
                $mdDialog.show(editDialog).then(_dialogComplete).catch(_dialogAbort);
            }).catch(function(err) {
                console.log(err);
            });
        }

        function createUser (event) {
          var createDialog = $.extend({}, dialogOptions);
          createDialog.event = event;
          createDialog.locals = {
              currentUser: {},
              state: 'creando'
          };
          $mdDialog.show(createDialog).then(_dialogComplete).catch(_dialogAbort);
        }

        function _dialogComplete(respuesta) {
            $mdToast.show(
                $mdToast.simple()
                .content(respuesta)
                .position('right bottom')
            );
        }

        function _dialogAbort(err) {
            $mdToast.show(
                $mdToast.simple()
                .content(err)
                .position('right bottom')
            );
            console.log(err);
        }
    }
})();
