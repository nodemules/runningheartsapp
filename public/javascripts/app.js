// global angular
var APP_NAME = 'runningHeartsApp';
(function(angular) {

  'use strict';

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($mdThemingProvider) {
      var whiteMap = $mdThemingProvider.extendPalette('red', {
        '500' : '#ffffff'
      })
      $mdThemingProvider.definePalette('white', whiteMap);

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('deep-orange', {
          'default': '900'
        })
        .backgroundPalette('grey', {
          'hue-1' : '400'
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.when('/venues', '/venues/list')

      $urlRouterProvider.when('/events', '/events/list')

      $urlRouterProvider.when('/players', '/players/list')

      $stateProvider
        .state('venues', {
          url : 'venues',
          parent: 'home',
          templateUrl: '/views/venues.html',
          controller: 'venuesCtrl',
          controllerAs: 'venues',
          redirectTo: 'venues.list'
        })
        .state('venues.list', {
          url : '/list',
          parent: 'venues',
          templateUrl: '/views/venues.list.html',
          controller: 'venuesListCtrl',
          controllerAs: 'vl'
        })
        .state('venues.manage', {
          url : '/manage/:id',
          parent: 'venues',
          templateUrl: '/views/venues.manage.html',
          controller: 'venuesManageCtrl',
          controllerAs: 'vm'
        })
        .state('venues.view', {
          url : '/view/:id',
          parent: 'venues',
          templateUrl: '/views/venues.view.html',
          controller: 'venuesViewCtrl',
          controllerAs: 'vv'
        })

      $stateProvider
        .state('players', {
          url : 'players',
          parent: 'home',
          templateUrl: '/views/players.html',
          controller: 'playersCtrl',
          controllerAs: 'players',
          redirectTo: 'players.list'
        })
        .state('players.list', {
          url : '/list',
          parent: 'players',
          templateUrl: '/views/players.list.html',
          controller: 'playersListCtrl',
          controllerAs: 'pl',
        })
        .state('players.manage', {
          url : '/manage/:id',
          parent: 'players',
          templateUrl: '/views/players.manage.html',
          controller: 'playersManageCtrl',
          controllerAs: 'pm',
        }) 
        .state('players.view', {
          url : '/view/:id',
          parent: 'players',
          templateUrl: '/views/players.view.html',
          controller: 'playersViewCtrl',
          controllerAs: 'pv',
        }) 

      $stateProvider
        .state('events', {
          url : 'events',
          parent: 'home',
          templateUrl: '/views/events.html',
          controller: 'eventsCtrl',
          controllerAs: 'events',
          redirectTo: 'events.list'
        })
        .state('events.list', {
          url : '/list',
          parent: 'events',
          templateUrl: '/views/events.list.html',
          controller: 'eventsListCtrl',
          controllerAs: 'el'
        })
        .state('events.manage', {
          url : '/manage/:id',
          parent: 'events',
          templateUrl: '/views/events.manage.html',
          controller: 'eventsManageCtrl',
          controllerAs: 'em'
        }) 
        .state('events.view', {
          url : '/view/:id',
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
        .state('games.play', {
          url: '/play/:id',
          parent: 'games',
          templateUrl: '/views/games.play.html',
          controller: 'gamesPlayCtrl',
          controllerAs: 'gp'
        })

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url : '/',
          templateUrl: '/views/home.html',
          controller: 'homeCtrl',
          controllerAs: 'home'
        })

      
      $locationProvider.html5Mode({
        enabled : true,
        requireBase : true
      });

    })
})(angular);