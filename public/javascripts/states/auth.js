{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .config(($stateProvider) => {

      $stateProvider
        .state('login', {
          url: 'login',
          parent: 'home',
          templateUrl: '/views/login.html',
          controller: 'loginCtrl',
          controllerAs: 'lg',
          resolve: {
            auth: ['authProvider', function(authProvider) {
              return authProvider.isLoggedIn('home', true);
            }]
          }
        })
        .state('register', {
          url: 'register',
          parent: 'home',
          templateUrl: '/views/register.html',
          controller: 'registerCtrl',
          controllerAs: 'rg',
          resolve: {
            auth: ['authProvider', function(authProvider) {
              return authProvider.isLoggedIn('home', true);
            }]
          }
        })

    })
}
