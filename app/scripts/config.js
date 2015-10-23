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
    onRun.$inject = ['amMoment'];


    // ui.router configuration for views
    function configRoutes ($stateProvider, $urlRouterProvider, $locationProvider, TMPDIR) {
      $locationProvider.html5Mode(true);
      $urlRouterProvider.otherwise('');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: TMPDIR + 'main.tpl.html',
          controller: 'HomeController',
          controllerAs: 'HomeCtrl'
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
        .state('config', {
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
    function onRun (amMoment) {
      amMoment.changeLocale('es');
    }
})();
