(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .controller('DialogController', DialogController);

    DialogController.$inject = ['$mdDialog', 'currentUser', 'Auth', 'state'];

    function DialogController($mdDialog, currentUser, Auth, state) {
        var vm = this;
        vm.guardar = guardarDialog;
        vm.headding = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase() + ' usuario';
        vm.editing = state.toLowerCase() === 'editando' || false;
        vm.cancelar = cancelDialog;
        vm.saveUser = saveUser;


        active();

        function active() {
            console.log('Activating Dialog....');
            vm.selectedUser = currentUser;
        }

        function saveUser (user2save) {
          console.log(user2save);
          if (vm.editing) {
            Auth.updateProfile(user2save).then(function () {
              guardarDialog(user2save.username + ' salvado');
            }).catch(function (err) {
              console.log(err);
            });
          } else {
            Auth.register(user2save).then(function () {
              guardarDialog(user2save.username + ' creado con exito');
            }).catch(function (err) {
              console.log(err);
            });
          }
        }

        function cancelDialog(respuesta) {
            $mdDialog.cancel(respuesta);
        }

        function guardarDialog(respuesta) {
            $mdDialog.hide(respuesta);
        }
    }
})();
