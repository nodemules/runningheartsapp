{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(['$stateProvider', ($stateProvider) => {

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
          controllerAs: 'gp',
          resolve: {
            auth: ['authProvider', '$stateParams', function(authProvider, $stateParams) {
              return authProvider.authWithPermissionsPassParams('games.view', {
                id: $stateParams.id
              }, ['PLAY_GAME']);
            }]
          }
        })
        .state('games.players', {
          url: '/players',
          parent: 'games.play',
          templateUrl: '/views/games.players.html',
          controller: 'gamesPlayersCtrl',
          controllerAs: 'gp',
          historyIgnore: true
        })
        .state('games.players.add', {
          url: '/:gameId/players/add',
          parent: 'games',
          templateUrl: '/views/games.players.add.html',
          controller: 'gamesPlayersCtrl',
          controllerAs: 'gp',
          historyIgnore: true,
          resolve: {
            auth: ['authProvider', '$stateParams', function(authProvider, $stateParams) {
              return authProvider.authWithPermissionsPassParams('games.view', {
                id: $stateParams.id
              }, ['PLAY_GAME']);
            }]
          }
        });
    }]);
}
