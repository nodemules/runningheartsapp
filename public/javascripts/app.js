// global angular
var APP_NAME = 'runningHeartsApp';
(function(angular) {

  'use strict';

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url : '/',
          templateUrl: '/views/home.html',
          controller: 'homeCtrl',
          controllerAs: 'home'
        })
        .state('venues', {
          url : 'venues',
          parent: 'home',
          templateUrl: '/views/venues.html',
          controller: 'venuesCtrl',
          controllerAs: 'venues'
        })
        .state('players', {
          url : 'players',
          parent: 'home',
          templateUrl: '/views/players.html',
          controller: 'playersCtrl',
          controllerAs: 'players'
        })
        .state('events', {
          url : 'events',
          parent: 'home',
          templateUrl: '/views/events.html',
          controller: 'eventsCtrl',
          controllerAs: 'events'
        })

      
      $locationProvider.html5Mode({
        enabled : true,
        requireBase : true
      });

    })
})(angular);