{
  angular.module(APP_NAME).factory('errorService', errorService);

  errorService.$inject = ['$resource', '$state'];

  function errorService($resource, $state) {

    var service = {
      handleApiError
    }

    return service;

    /////////////////////

    function handleApiError(error) {
      var requestData = error.config.data;
      requestData.$$saving = false;
      requestData.$$error = error.data;
    }

  }

}
