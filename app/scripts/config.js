(function(){
    'use strict';
    angular.module('reservacionesMulti')
            .constant('FURL', 'https://reservasmultiuso.firebaseio.com/')
            .constant('TMPDIR', 'views/')
            .config(configRoutes)
            .config(configPalette)
            .run(onRun);

    // Dependency Injection
    configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'TMPDIR'];
    configPalette.$inject = ['$mdThemingProvider'];
    onRun.$inject = ['$rootScope', 'amMoment', '$state', '$mdToast' , 'Auth', 'Session'];


    // ui.router configuration for views
    function configRoutes ($stateProvider, $urlRouterProvider, $locationProvider, TMPDIR) {
      $locationProvider.html5Mode(true);
      $urlRouterProvider.otherwise('');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: TMPDIR + 'main.tpl.html',
          controller: 'HomeController',
          controllerAs: 'HomeCtrl',
          resolve: {
            today: function (Reservaciones){return Reservaciones.today();},
            upcomming: function (Reservaciones){return Reservaciones.getCommingSoon();}
          }
        })
        .state('search', {
          url: '/search/',
          templateUrl: TMPDIR + 'search.tpl.html',
          controller: 'SearchController',
          controllerAs: 'SearchCtrl'
        })
        .state('create', {
          url: '/create/',
          templateUrl: TMPDIR + 'create.tpl.html',
          controller: 'AdminController',
          controllerAs: 'AdminCtrl'
        })
        .state('help', {
          url: '/about/',
          templateUrl: TMPDIR + 'help.tpl.html',
          controller: 'HelpController',
          controllerAs: 'HelpCtrl'
        })
        .state('login', {
          url: '/login/',
          templateUrl: TMPDIR + 'login.tpl.html',
          controller: 'AuthController',
          controllerAs: 'AuthCtrl'
        })
        .state('profile', {
          url: '/user/',
          templateUrl: TMPDIR + 'userconfig.tpl.html',
          controller: 'AdminController',
          controllerAs: 'AdminCtrl'
        });
    }

    // ngMaterial Configuration for colorPalette
    function configPalette ($mdThemingProvider) {
      $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('teal');
    }

    // amMoment Configuration for TimeZone with Momentjs
    function onRun ($rootScope, amMoment, $state, $mdToast, Auth, Session) {
      amMoment.changeLocale('es');
      $rootScope.$state = $state;
      $rootScope.Auth = Auth;
      $rootScope.Session = Session;
      $rootScope.$on('$stateChangeStart', function(event, toState) {
        if ((toState.url === '/create/' || toState.url === '/user/') && !Auth.signedIn()) {
          event.preventDefault();
          $mdToast.show(
            $mdToast.simple()
            .content('No tiene Permiso para acceder a esta área')
            .position('right bottom')
          );
          $state.go('home');
        }
      });
    }
})();
