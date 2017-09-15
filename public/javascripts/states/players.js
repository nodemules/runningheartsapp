{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

      $urlRouterProvider.when('/players', '/players/list');

      $stateProvider
        .state('players', {
          url: 'players',
          parent: 'home',
          templateUrl: '/views/players.html',
          controller: 'playersCtrl',
          controllerAs: 'players',
          redirectTo: 'players.list'
        })
        .state('players.list', {
          url: '/list',
          parent: 'players',
          templateUrl: '/views/players.list.html',
          controller: 'playersListCtrl',
          controllerAs: 'pl',
        })
        .state('players.manage', {
          url: '/manage/:id',
          params: {
            season: null,
            allTime: false
          },
          parent: 'players',
          templateUrl: '/views/players.manage.html',
          controller: 'playersManageCtrl',
          controllerAs: 'pm',
          historyIgnore: true,
          resolve: {
            auth: ['authProvider', '$stateParams', function(authProvider, $stateParams) {
              var permissions = [];
              permissions.push($stateParams.id ? 'EDIT_PLAYER' : 'ADD_PLAYER');
              return authProvider.authWithPermissions('players.list', permissions);
            }]
          }
        })
        .state('players.view', {
          url: '/view/:id',
          params: {
            season: null,
            allTime: false
          },
          parent: 'players',
          templateUrl: '/views/players.view.html',
          controller: 'playersViewCtrl',
          controllerAs: 'pv',
        })
        .state('players.view.games', {
          url: '/view/:id/games',
          params: {
            season: null,
            allTime: false
          },
          parent: 'players',
          templateUrl: '/views/players.view.games.html',
          controller: 'playersViewCtrl',
          controllerAs: 'pv',
        });

    }]);
}
