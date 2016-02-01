configuration.$inject = ['$stateProvider', '$urlRouterProvider',
'$locationProvider', '$mdThemingProvider', 'TPLDIR'];

/**
 * The main Angular Configurartion For Routes and mdThemes
 * @param  {Object} $stateProvider     Defining States/Routes
 * @param  {Object} $urlRouterProvider Redirections For Other Routes
 * @param  {Object} $locationProvider  To eneable HTML5MODE
 * @param  {Object} $mdThemingProvider Configuring Color Palete
 * @param  {String} TPLDIR             Tepmlates Directory
 */
export function configuration($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, TPLDIR) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('teal');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: TPLDIR + 'main.tpl.html',
      controller: 'HomeController',
      controllerAs: 'HomeCtrl'
    })
    .state('search', {
      url: '/search/',
      templateUrl: TPLDIR + 'search.tpl.html',
      controller: 'SearchController',
      controllerAs: 'SearchCtrl'
    })
    .state('places', {
      url: '/places/',
      templateUrl: TPLDIR + 'places.tpl.html',
      controller: 'PlacesController',
      controllerAs: 'PlacesCtrl'
    })
    .state('profesor', {
      url: '/profesor/',
      templateUrl: TPLDIR + 'profesor.tpl.html',
      controller: 'ProfesorsController',
      controllerAs: 'ProfesorsCtrl'
    })
    .state('create', {
      url: '/create/',
      templateUrl: TPLDIR + 'create.tpl.html',
      controller: 'AdminController',
      controllerAs: 'AdminCtrl'
    })
    .state('help', {
      url: '/about/',
      templateUrl: TPLDIR + 'help.tpl.html',
      controller: 'HelpController',
      controllerAs: 'HelpCtrl'
    })
    .state('login', {
      url: '/login/',
      templateUrl: TPLDIR + 'login.tpl.html',
      controller: 'AuthController',
      controllerAs: 'AuthCtrl'
    })
    .state('profile', {
      url: '/user/',
      templateUrl: TPLDIR + 'userconfig.tpl.html',
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
      templateUrl: TPLDIR + 'manageusers.tpl.html',
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
      if (_requireLoginLevel(toState.url) && !Auth.signedIn()) {
        event.preventDefault();
        $mdToast.show(
          $mdToast.simple()
          .content('No tiene Permiso para acceder a esta área')
          .position('right bottom')
        );
        $state.go('home');
      } else if (_requireAdminLevel(toState.url) && !Auth.user.profile.isAdmin) {
        event.preventDefault();
        $mdToast.show(
          $mdToast.simple()
          .content('Necesitas ser Administrador para acceder a esta área')
          .position('right bottom')
        );
        $state.go('home');
      }
    }, 1500);
  });
}

/**
 * Restrict Acces to Certain Routes
 * @param  {String} url the url Provided by the State
 * @return {Boolean}     Return if the URL is on the forbidenUrls
 */
function _requireLoginLevel(url) {
  // Here you can add as many as you routes
  // you need with permisions or loggedIn users
  let forbidenUrls = ['/create/', '/user/'];

  return forbidenUrls.indexOf(url) >= 0;
}

/**
 * Restrict Acces to Certain Routes to no admin
 * @param  {String} url the url Provided by the State
 * @return {Boolean}     Return if the URL is on the forbidenUrls
 */
function _requireAdminLevel(url) {
  // Here you can add as many as you routes
  // you need with permisions or loggedIn users
  let forbidenUrls = ['/places/', '/manage-users/'];

  return forbidenUrls.indexOf(url) >= 0;
}
