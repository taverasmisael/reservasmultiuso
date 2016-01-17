configuration.$inject = ['$stateProvider', '$urlRouterProvider',
'$locationProvider', '$mdThemingProvide', 'TMPDIR'];

/**
 * The main Angular Configurartion For Routes and mdThemes
 * @param  {Object} $stateProvider     Defining States/Routes
 * @param  {Object} $urlRouterProvider Redirections For Other Routes
 * @param  {Object} $locationProvider  To eneable HTML5MODE
 * @param  {Object} $mdThemingProvider Configuring Color Palete
 * @param  {String} TMPDIR             Tepmlates Directory
 */
export function configuration($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, TMPDIR) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('teal');

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
    .state('login', {
      url: '/login/',
      templateUrl: TMPDIR + 'login.tpl.html',
      controller: 'AuthController',
      controllerAs: 'AuthCtrl'
    })
    .state('profile', {
      url: '/user/',
      templateUrl: TMPDIR + 'userconfig.tpl.html',
      controller: 'UsersController',
      controllerAs: 'UsersCtrl',
      resolve: {
        profiles: ['Auth', function(Auth) {
          return Auth.loadProfiles();
        }]
      }
    })
    .state('manage', {
      url: '/manage-users/',
      templateUrl: TMPDIR + 'manageusers.tpl.html',
      controller: 'UsersController',
      controllerAs: 'UsersCtrl',
      resolve: {
        profiles: ['Auth', function(Auth) {
          return Auth.loadProfiles();
        }]
      }
    });
}

onRun.$inject = ['$timeout', '$rootScope', 'amMoment', '$state',
'$mdToast', 'Auth'];

/**
 * This Function Will Run Everytime Angular Instatiate the app
 * @param  {Function} $timeout   JsTimeout function with ngSuperPowers
 * @param  {Object} $rootScope The main container of our app
 * @param  {Object} amMoment   ngMoment for Dates
 * @param  {Object} $state     Is the provider of our States
 * @param  {Function} $mdToast   ngMaterial Toast Service
 * @param  {Service} Auth       Authentication service
 */
export function onRun($timeout, $rootScope, amMoment, $state, $mdToast, Auth) {
  amMoment.changeLocale('es');
  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    $timeout(() => {
      if (_getForbidenStates(toState.url) && !Auth.signedIn()) {
        event.preventDefault();
        $mdToast.show(
          $mdToast.simple()
          .content('No tiene Permiso para acceder a esta área')
          .position('right bottom')
        );
        $state.go('home');
      }
    }, 1000);
  });
}

/**
 * Restrict Acces to Certain Routes
 * @param  {String} url the url Provided by the State
 * @return {Boolean}     Return if the URL is on the forbidenUrls
 */
function _getForbidenStates(url) {
  // Here you can add as many as you routes
  // you need with permisions or loggedIn users
  let forbidenUrls = ['/create/', '/user/', '/manage-users/'];

  return forbidenUrls.indexOf(url) >= 0;
}
