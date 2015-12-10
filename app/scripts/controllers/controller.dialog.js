(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .controller('DialogController', DialogController);

    DialogController.$inject = ['$mdDialog', 'currentUser', 'state'];

    function DialogController($mdDialog, currentUser, state) {
        var vm = this;
        vm.guardar = guardarDialog;
        vm.headding = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase() + ' usuario';
        vm.editing = state.toLowerCase() === 'editando' || false;
        vm.cancelar = cancelDialog;
        vm.saveUser =saveUser;


        active();

        function active() {
            console.log('Activating Dialog....');
            vm.selectedUser = currentUser;
        }

        function saveUser (user2save) {
          console.log(user2save);
          guardarDialog('Usuario Salvado');
        }

        function cancelDialog(respuesta) {
            $mdDialog.cancel(respuesta);
        }

        function guardarDialog(respuesta) {
            $mdDialog.confirm(respuesta);
        }
    }
})();
