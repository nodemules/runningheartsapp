{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($stateProvider, $urlRouterProvider) => {

      $urlRouterProvider.when('/stats', '/stats/season');

      $stateProvider
        .state('stats', {
          url: 'stats',
          parent: 'home',
          templateUrl: '/views/stats.html',
          controller: 'statsCtrl',
          controllerAs: 'vm',
          redirectTo: 'stats.season'
        })
        .state('stats.season', {
          url: '/season',
          parent: 'stats',
          params: {
            all: null
          },
          templateUrl: '/views/stats.season.html',
          controller: 'statsSeasonCtrl',
          controllerAs: 'vm'
        })
        .state('stats.seasons', {
          url: '/seasons/:id',
          parent: 'stats',
          templateUrl: '/views/stats.season.html',
          controller: 'statsSeasonCtrl',
          controllerAs: 'vm'
        })
        .state('stats.season.all', {
          url: '/seasons/all/:id',
          parent: 'stats',
          params: {
            all: null
          },
          templateUrl: '/views/stats.season.all.html',
          controller: 'statsSeasonCtrl',
          controllerAs: 'vm'
        });
    });
}
