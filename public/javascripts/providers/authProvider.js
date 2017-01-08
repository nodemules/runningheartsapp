{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .service('authProvider', authProvider);

  authProvider.$inject = ['$http', '$q'];

  function authProvider($http, $q) {

    var basePath = '/api/auth'

    var service = {
      isLoggedIn,
      authWithPermissions
    }

    return service;

    function resolveRedirect(deferred, promise, onSuccess) {
      return onSuccess ? deferred.resolve({}) : deferred.reject(promise);
    }

    /**
     *
     * Checks if the user is logged in, and performs a redirect if they
     * are not. With the @param onSuccess boolean, the redirect is performed
     * <em>if</em> the user <em>is</em> logged in.
     * @param redirectTo - the $state uri to redirect to
     * @param onSuccess - perform redirect when user <em>is</em> logged in
     *
     * @return the promise containing the authorization state and potentially
     *         a redirect for the $state
     */
    function isLoggedIn(redirectTo, onSuccess) {
      var deferred = $q.defer();
      $http.get(basePath).then(() => {
        let promise = {
          redirectTo: redirectTo,
          code: 'User is authenticated'
        }
        deferred = resolveRedirect(deferred, promise, !onSuccess);
      }, (err) => {
        let promise = {
          redirectTo: redirectTo,
          code: err.data.code
        }
        deferred = resolveRedirect(deferred, promise, onSuccess);
      })

      return deferred.promise;
    }

    function authWithPermissions(redirectTo, permissions) {
      var deferred = $q.defer();
      $http.post(`${basePath}/permission`, {
        permissions: permissions
      }).then(() => {
        deferred.resolve({});
      }, (err) => {
        deferred.reject({
          redirectTo: redirectTo,
          code: err.data.code
        });
      })
      return deferred.promise;
    }
  }

}
