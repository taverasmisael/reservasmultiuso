(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SearchController', SearchController);

    SearchController.$inject = [];
    function SearchController () {
        active();

        function active () {
          console.log('Active Search....');
        }
    }
})();
