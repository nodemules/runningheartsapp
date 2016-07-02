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
          templateUrl: '/views/venues.list.html'
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
          templateUrl: '/views/players.list.html'
        })
        .state('players.manage', {
          url : '/manage',
          parent: 'players',
          templateUrl: '/views/players.manage.html'
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
          templateUrl: '/views/events.list.html'
        })
        .state('events.manage', {
          url : '/manage',
          parent: 'events',
          templateUrl: '/views/events.manage.html'
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