(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = [];
    function AdminController () {
        var vm = this;
        active();

        function active () {
          console.log('Administrating...');
          vm.today = new Date();
          vm.minReservationDate = new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate() - 1);
          console.log(vm.minReservationDate);
        }
    }
})();
