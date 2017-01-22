{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .service('authProvider', authProvider);

  authProvider.$inject = ['$http', '$q', 'authService', 'permissionsService'];

  function authProvider($http, $q, authService, permissionsService) {

    var basePath = '/api/auth';

    var service = {
      isLoggedIn,
      authWithPermissions,
      authWithPermissionsPassParams
    }

    return service;

    function authFailure() {
      authService.authenticate(false);
      permissionsService.clearPermissions();
    }

    /**
     * @private  {function}         resolveRedirect
     *
     * @description                 dynamically determines whether to resolve or
     *   reject the promise
     *
     * @param  {object} deferred    the $q.defer() object
     * @param  {object} promise     the promise to resolve or reject
     * @param  {boolean} onSuccess  determines whether to resolve or reject the promise
     *
     * @returns {object}            the $q.defer() object, resolved or rejected
     */
    function resolveRedirect(deferred, promise, onSuccess) {
      return onSuccess ? deferred.resolve({}) : deferred.reject(promise);
    }

    /**
     * @public  {function}           isLoggedIn
     *
     * @description                  checks if the user is logged in, and performs
     *   a redirect if they are not. With the @param onSuccess boolean, the redirect
     *   is performed <em>if</em> the user <em>is</em> logged in
     *
     * @param  {object} redirectTo   the angular $state uri to redirect to
     * @param  {boolean} onSuccess   perform redirect when user <em>is</em> logged in
     *
     * @returns  {object}            the promise containing the authorization state
     *   and potentially a redirect for the $state
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
        authFailure();
        let promise = {
          redirectTo: redirectTo,
          code: err.data.code
        }
        deferred = resolveRedirect(deferred, promise, onSuccess);
      })

      return deferred.promise;
    }

    /**
     * @public {function}             authWithPermissions
     *
     * @description                   performs a redirect if the user does
     *   not pass the authorization check with the given permissions
     *
     * @param  {object} redirectTo    the angular $state uri to redirect to
     * @param  {array} permissions    an array of permission names
     *
     * @returns  {object}             the promise containing the authorization
     *   state and a potential redirect
     */
    function authWithPermissions(redirectTo, permissions) {
      return authWithPermissionsPassParams(redirectTo, null, permissions);
    }

    /**
     * @public {function}                 authWithPermissionsPassParams
     *
     * @description                       perform a redirect to an
     *   angular $state requiring a param (e.g. :id) if the user does
     *   not pass the authorization check with the given permissions
     *
     * @param  {object} redirectTo        the angular $state uri to redirect to
     * @param  {object} redirectParams    the parameters to pass to the $state uri
     * @param  {array} permissions        an array of permission names
     * @returns  {object}                 the promise containing the authorization
     *   state and a potential redirect
     */
    function authWithPermissionsPassParams(redirectTo, redirectParams, permissions) {
      var deferred = $q.defer();
      $http.post(`${basePath}/permission`, {
        permissions: permissions
      }).then(() => {
        deferred.resolve({});
      }, (err) => {
        authFailure();
        deferred.reject({
          redirectTo: redirectTo,
          redirectParams: redirectParams,
          code: err.data.code
        });
      })
      return deferred.promise;
    }
  }

}
