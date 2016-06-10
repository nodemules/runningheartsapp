// global angular
var APP_NAME = 'runningHeartsApp';
(function(angular) {
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
        .state('test', {
          url : '/test',
          templateUrl: '/views/test.html',
          controller: 'homeCtrl',
          controllerAs: 'test'
        })

      $locationProvider.html5Mode({
        enabled : true,
        requireBase : true
      });

    })
})(angular);