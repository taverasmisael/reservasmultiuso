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
        vm.deleteUser = deleteUser;
        vm.arrangeTable = arrangeTable;
        vm.tableOrder = 'name';

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

        function deleteUser (event, uid) {
          var confirm = $mdDialog.confirm({
                              title: '¡Atención!',
                              content: '¿Está seguro que desea elminar este usuario?',
                              ariaLabel:'Confirmar: Eliminar Usuario',
                              targetEvent: event,
                              ok: 'Estoy Seguro',
                              cancel: 'No deseo eliminarlo'
                              });
          $mdDialog.show(confirm).then(function () {
            Auth.removeUser(uid).then(_dialogComplete('Usuario Eliminado')).catch(_dialogAbort);
          });
        }

        function arrangeTable (order) {
          console.log(order);
          vm.tableOrder = order;
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
