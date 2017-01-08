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
    .run(($rootScope, $state) => {
      $rootScope.$on('$stateChangeError', (evt, to, toParams, from, fromParams, error) => {
        console.log(error);
        if (error.code === 'NO_USER_FOUND') {
          $state.go('login')
        } else if (error.redirectTo) {
          console.log(`Redirect to ${error.redirectTo} because ${error.code}`)
          $state.transitionTo(error.redirectTo, {
            reason: error.code
          });
        }
      })
    })

}
