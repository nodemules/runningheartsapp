{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('formService', formService);

  formService.$inject = [];

  function formService() {

    var service = {
      resetValidity
    }

    return service;

    /////////////////////

    function resetValidity(elem, validator) {
      if (elem.$invalid) {
        return elem.$setValidity(validator, true);
      }
    }

  }
}
