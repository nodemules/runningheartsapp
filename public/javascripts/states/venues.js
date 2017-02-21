{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($stateProvider, $urlRouterProvider) => {

      $urlRouterProvider.when('/venues', '/venues/list')

      $stateProvider
        .state('venues', {
          url: 'venues',
          parent: 'home',
          templateUrl: '/views/venues.html',
          controller: 'venuesCtrl',
          controllerAs: 'venues',
          redirectTo: 'venues.list'
        })
        .state('venues.list', {
          params: {
            reason: null
          },
          url: '/list',
          parent: 'venues',
          templateUrl: '/views/venues.list.html',
          controller: 'venuesListCtrl',
          controllerAs: 'vl',
        })
        .state('venues.manage', {
          url: '/manage/:id',
          parent: 'venues',
          templateUrl: '/views/venues.manage.html',
          controller: 'venuesManageCtrl',
          controllerAs: 'vm',
          resolve: {
            auth: ['authProvider', '$stateParams', function(authProvider, $stateParams) {
              var permissions = []
              permissions.push($stateParams.id ? 'EDIT_VENUE' : 'ADD_VENUE');
              return authProvider.authWithPermissions('venues.list', permissions);
            }]
          }
        })
        .state('venues.view', {
          url: '/view/:id',
          parent: 'venues',
          templateUrl: '/views/venues.view.html',
          controller: 'venuesViewCtrl',
          controllerAs: 'vv'
        })

    })
}
