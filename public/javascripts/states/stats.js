{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(['$stateProvider', ($stateProvider) => {

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

    }])
}
