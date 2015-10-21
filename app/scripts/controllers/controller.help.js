(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('HelpController', HelpController);

    HelpController.$inject = [];
    function HelpController () {
        active();

        function active () {
          console.log('Helping...');
        }
    }
})();
