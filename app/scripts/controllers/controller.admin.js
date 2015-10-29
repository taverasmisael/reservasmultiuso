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
        }
    }
})();
