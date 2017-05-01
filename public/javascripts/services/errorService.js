{
  angular.module(APP_NAME).factory('errorService', errorService);

  errorService.$inject = ['$state', 'authService'];

  function errorService($state, authService) {

    var service = {
      handleApiError
    }

    return service;

    /////////////////////

    function handleApiError(error) {
      var requestData = error.config.data;
      requestData.$$saving = false;
      requestData.$$error = error.data;
      switch (error.data.code) {
        case 'NO_USER_FOUND':
          authService.authenticate(false);
          break;
        default:
          break;

      }
    }

  }

}
