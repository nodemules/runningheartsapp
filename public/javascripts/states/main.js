{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($urlRouterProvider, $stateProvider) => {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/views/home.html',
          controller: 'homeCtrl',
          controllerAs: 'home'
        })

    })
    .run(($rootScope, $state, authService, historyService) => {
      $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        if (!fromState.abstract && !historyService.isGoingBack() && !fromState.historyIgnore) {
          historyService.pushState(fromState, fromParams);
        }
      })
      $rootScope.$on('$stateChangeError', (evt, to, toParams, from, fromParams, error) => {
        if (!historyService.hasHistory()) {
          historyService.pushState(to, toParams);
        }
        switch (error.code) {
          case 'NO_USER_FOUND':
            authService.authenticate(false);
            $state.go('login');
            break;
          case 'PERMISSIONS_INVALID':
            console.log(`Redirect to ${error.redirectTo} because ${error.code}`)
            $state.transitionTo(error.redirectTo, {
              reason: error.code
            });
            break;
          default:
            console.error('No error code found, redirecting home', error);
            $state.go('home');
            break;
        }
      })
    })

}
