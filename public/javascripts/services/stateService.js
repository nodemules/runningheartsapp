{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('stateService', stateService);

  stateService.$inject = ['$state', '$stateParams'];

  function stateService($state, $stateParams) {

    var service = {
      setParams,
      resetParams
    };

    return service;

    function setParams(params) {
      if (!params) {
        return console.error('Cannot set $stateParams to null');
      }
      $state.go('.', params, {
        inherit: false,
        notify: false
      });
    }

    function resetParams(preserveId) {
      var id = $stateParams.id;
      var params = {};
      if (!!preserveId) {
        params.id = id;
      }
      $state.go('.', params, {
        inherit: false,
        notify: false
      });

    }

  }

}
