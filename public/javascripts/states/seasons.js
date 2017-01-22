{
  {
    /* global angular, APP_NAME */
    angular
      .module(APP_NAME)
      .config(($stateProvider, $urlRouterProvider) => {

        $urlRouterProvider.when('/seasons', '/seasons/view')

        $stateProvider
          .state('seasons', {
            url: 'seasons',
            parent: 'home',
            templateUrl: '/views/seasons.html',
            controller: 'seasonsCtrl',
            controllerAs: 'seasons',
            redirectTo: 'seasons.view'
          })
          .state('seasons.view', {
            url: '/view',
            parent: 'seasons',
            templateUrl: '/views/seasons.view.html',
            controller: 'seasonsViewCtrl',
            controllerAs: 'vm'
          })

      })
  }

}
