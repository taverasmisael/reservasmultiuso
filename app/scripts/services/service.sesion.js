(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .service('Session', Session);

    Session.$inject = [];
    function Session () {
        var authData = JSON.parse(localStorage.getItem('session.authData'));

        var SessionService = {
          getAuthData: authData,
          setAuthData: setAuthData,
          destroyAuthData: destroyAuthData
        };

        return SessionService;

        function setAuthData (data) {
          authData = data;
          localStorage.setItem('session.authData', JSON.stringify(data));
        }

        function destroyAuthData () {
          setAuthData(null);
        }
    }
})();
