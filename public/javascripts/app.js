// global angular
var APP_NAME = 'runningHeartsApp';
(function(angular) {

  'use strict';

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($mdThemingProvider) {
      var whiteMap = $mdThemingProvider.extendPalette('red', {
        '500': '#ffffff'
      })
      $mdThemingProvider.definePalette('white', whiteMap);

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('deep-orange', {
          'default': '900'
        })
        .backgroundPalette('grey', {
          'hue-1': '400'
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.when('/venues', '/venues/list')

      $urlRouterProvider.when('/events', '/events/list')

      $urlRouterProvider.when('/players', '/players/list')

      $stateProvider
        .state('login', {
          url: 'login',
          parent: 'home',
          templateUrl: '/views/login.html',
          controller: 'loginCtrl',
          controllerAs: 'lg',
          resolve: {
            auth: function($q, $http) {
              var deferred = $q.defer();
              $http.get('/api/auth').then(function(res) {
                deferred.reject({
                  redirectTo: 'home'
                });
              }, function(err) {
                deferred.resolve({});
              })
              return deferred.promise;
            }
          }
        })
        .state('register', {
          url: 'register',
          parent: 'home',
          templateUrl: '/views/register.html',
          controller: 'registerCtrl',
          controllerAs: 'rg',
          resolve: {
            auth: function($q, $http) {
              var deferred = $q.defer();
              $http.get('/api/auth').then(function(res) {
                deferred.reject({
                  redirectTo: 'home'
                });
              }, function(err) {
                deferred.resolve({});
              })
              return deferred.promise;
            }
          }
        })

      $stateProvider
        .state('venues', {
          url: 'venues',
          parent: 'home',
          templateUrl: '/views/venues.html',
          controller: 'venuesCtrl',
          controllerAs: 'venues',
          redirectTo: 'venues.list'
        })
        .state('venues.list', {
          params: {
            reason: null
          },
          url: '/list',
          parent: 'venues',
          templateUrl: '/views/venues.list.html',
          controller: 'venuesListCtrl',
          controllerAs: 'vl',
        })
        .state('venues.manage', {
          url: '/manage/:id',
          parent: 'venues',
          templateUrl: '/views/venues.manage.html',
          controller: 'venuesManageCtrl',
          controllerAs: 'vm',
          resolve: {
            auth: function($q, $http) {
              var deferred = $q.defer();
              $http.post('/api/auth/permission', {
                permissions: [`Permission.MANAGE_VENUE`]
              }).then(function(res) {
                  deferred.resolve({});
                },
                function(err) {
                  deferred.reject({
                    redirectTo: `venues.list`,
                    code: err.data.code
                  });
                })
              return deferred.promise;
            }
          }
        })
        .state('venues.view', {
          url: '/view/:id',
          parent: 'venues',
          templateUrl: '/views/venues.view.html',
          controller: 'venuesViewCtrl',
          controllerAs: 'vv'
        })

      $stateProvider
        .state('players', {
          url: 'players',
          parent: 'home',
          templateUrl: '/views/players.html',
          controller: 'playersCtrl',
          controllerAs: 'players',
          redirectTo: 'players.list'
        })
        .state('players.list', {
          url: '/list',
          parent: 'players',
          templateUrl: '/views/players.list.html',
          controller: 'playersListCtrl',
          controllerAs: 'pl',
        })
        .state('players.manage', {
          url: '/manage/:id',
          parent: 'players',
          templateUrl: '/views/players.manage.html',
          controller: 'playersManageCtrl',
          controllerAs: 'pm',
        })
        .state('players.view', {
          url: '/view/:id',
          parent: 'players',
          templateUrl: '/views/players.view.html',
          controller: 'playersViewCtrl',
          controllerAs: 'pv',
        })

      $stateProvider
        .state('events', {
          url: 'events',
          parent: 'home',
          templateUrl: '/views/events.html',
          controller: 'eventsCtrl',
          controllerAs: 'events',
          redirectTo: 'events.list'
        })
        .state('events.list', {
          url: '/list',
          parent: 'events',
          templateUrl: '/views/events.list.html',
          controller: 'eventsListCtrl',
          controllerAs: 'el'
        })
        .state('events.manage', {
          url: '/manage/:id',
          parent: 'events',
          templateUrl: '/views/events.manage.html',
          controller: 'eventsManageCtrl',
          controllerAs: 'em'
        })
        .state('events.view', {
          url: '/view/:id',
          parent: 'events',
          templateUrl: '/views/events.view.html',
          controller: 'eventsViewCtrl',
          controllerAs: 'ev'
        })

      $stateProvider
        .state('games', {
          url: 'games',
          parent: 'home',
          templateUrl: '/views/games.html',
          controller: 'gamesCtrl',
          controllerAs: 'games',
          redirectTo: 'games.play',
          abstract: true
        })
        .state('games.view', {
          url: '/view/:id',
          parent: 'games',
          templateUrl: '/views/games.view.html',
          controller: 'gamesViewCtrl',
          controllerAs: 'gv'
        })
        .state('games.play', {
          url: '/play/:id',
          parent: 'games',
          templateUrl: '/views/games.play.html',
          controller: 'gamesPlayCtrl',
          controllerAs: 'gp'
        })
        .state('games.players', {
          url: '/players',
          parent: 'games.play',
          templateUrl: '/views/games.players.html',
          controller: 'gamesPlayersCtrl',
          controllerAs: 'gp'
        })
        .state('games.players.add', {
          url: '/:gameId/players/add',
          parent: 'games',
          templateUrl: '/views/games.players.add.html',
          controller: 'gamesPlayersCtrl',
          controllerAs: 'gp'
        })

      $stateProvider
        .state('stats', {
          url: 'stats',
          parent: 'home',
          templateUrl: '/views/stats.html',
          controller: 'statsCtrl',
          controllerAs: 'vm'
        })
        .state('stats.players', {
          url: '/players',
          parent: 'stats',
          templateUrl: '/views/stats.players.html',
          controller: 'statsPlayersCtrl',
          controllerAs: 'vm'
        })
        .state('stats.seasons', {
          url: '/seasons/:id',
          parent: 'stats',
          templateUrl: '/views/stats.players.html',
          controller: 'statsPlayersCtrl',
          controllerAs: 'vm'
        })

      $stateProvider
        .state('seasons', {
          url: 'seasons',
          parent: 'home',
          templateUrl: '/views/seasons.html',
          controller: 'seasonsCtrl',
          controllerAs: 'vm',
          redirectTo: 'seasons.view'
        })
        .state('seasons.view', {
          url: '/view',
          parent: 'seasons',
          templateUrl: '/views/seasons.view.html',
          controller: 'seasonsViewCtrl',
          controllerAs: 'vm'
        })

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/views/home.html',
          controller: 'homeCtrl',
          controllerAs: 'home'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });

    })
    .run(['$rootScope', '$state', function($rootScope, $state) {
      $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
        console.log(error);
        if (error.code === `NO_USER_FOUND`) {
          $state.go(`login`)
        } else if (error.redirectTo) {
          console.log(`Redirect to ${error.redirectTo} because ${error.code}`)
          $state.transitionTo(error.redirectTo, {
            reason: error.code
          });
        }
      })
    }])
})(angular);
