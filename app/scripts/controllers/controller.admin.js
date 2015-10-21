(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('AdminController', AdminController);

    AdminController.$inject = [];
    function AdminController () {
        active();

        function active () {
          console.log('Administrating...');
        }
    }
})();
