{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($stateProvider) => {

      $stateProvider
        .state('stats', {
          url: 'stats',
          parent: 'home',
          templateUrl: '/views/stats.html',
          controller: 'statsCtrl',
          controllerAs: 'vm'
        })
        .state('stats.season', {
          url: '/season',
          parent: 'stats',
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

    })
}
