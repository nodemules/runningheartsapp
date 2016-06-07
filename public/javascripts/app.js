// global angular
var APP_NAME = 'runningHeartsApp';
(function(angular) {
  var APP_DEPENDENCIES = ['ui.router'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url : '/',
          templateUrl: '/views/home.html'
        })

      $locationProvider.html5Mode({
        enabled : true,
        requireBase : true
      });
    })
})(angular);