(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .controller('SearchController', SearchController);

    SearchController.$inject = [];
    function SearchController () {
        var vm = this;
        vm.querySearch = querySearch;
        active();
        var monthList = Array.apply(0, Array(12)).map(
            function(_,i){
              return moment().month(i).format('MMMM')
            }
        );
        vm.months = [];
        vm.profesorsList = loadAll();
        for (var i = 0; i < monthList.length; i += 1) {
          var currentMonth = {
            index: i,
            name: monthList[i]
          };
          vm.months.push(currentMonth);
        }

        function active () {
          console.log('Active Search....');
          vm.today = new Date();
        }


        function querySearch (query) {
          console.log('Buscando...');
          var results = query ? vm.profesorsList.filter( createFilterFor(query) ) : [];
          return results;
        }

        // TEMPORARY FUNCTIONS
        function createFilterFor(query) {
             var lowercaseQuery = angular.lowercase(query);
             return function filterFn(profesor) {
                console.log('Filtrando...');
               return (profesor.value.indexOf(lowercaseQuery) === 0);
             };
           }


           function loadAll() {
                 var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                         Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                         Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                         Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                         North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                         South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                         Wisconsin, Wyoming';
                 return allStates.split(/, +/g).map( function (state) {
                   return {
                     value: state.toLowerCase(),
                     name: state
                   };
                 });
               }
    }
})();
