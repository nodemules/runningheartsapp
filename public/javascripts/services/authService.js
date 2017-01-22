{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('authService', authService);

  authService.$inject = [];

  function authService() {

    var isAuthenticated;

    var service = {
      isAuth,
      hasAuthenticated,
      authenticate
    }

    return service;

    /////////////////////

    function hasAuthenticated() {
      return isAuthenticated !== undefined;
    }

    function isAuth() {
      return !!isAuthenticated;
    }

    function authenticate(authState) {
      isAuthenticated = false || !!authState;
    }

  }

}
