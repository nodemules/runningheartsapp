{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($stateProvider, $urlRouterProvider) => {

      $urlRouterProvider.when('/events', '/events/list')

      $stateProvider
        .state('events', {
          url: 'events',
          parent: 'home',
          templateUrl: '/views/events.html',
          controller: 'eventsCtrl',
          controllerAs: 'events',
          redirectTo: 'events.list'
        })
        .state('events.list', {
          url: '/list',
          parent: 'events',
          templateUrl: '/views/events.list.html',
          controller: 'eventsListCtrl',
          controllerAs: 'el'
        })
        .state('events.manage', {
          url: '/manage/:id',
          parent: 'events',
          templateUrl: '/views/events.manage.html',
          controller: 'eventsManageCtrl',
          controllerAs: 'em',
          resolve: {
            auth: ['authProvider', '$stateParams', function(authProvider, $stateParams) {
              var permissions = []
              permissions.push($stateParams.id ? 'EDIT_EVENT' : 'ADD_EVENT');
              return authProvider.authWithPermissions('events.list', permissions);
            }]
          }
        })
        .state('events.view', {
          url: '/view/:id',
          parent: 'events',
          templateUrl: '/views/events.view.html',
          controller: 'eventsViewCtrl',
          controllerAs: 'ev'
        })

    })
}
