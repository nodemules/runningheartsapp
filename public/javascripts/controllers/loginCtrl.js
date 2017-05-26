// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'authApiService', 'historyService', 'formService'];

  function loginCtrl($state, authApiService, historyService, formService) {

    var vm = this;

    vm.login = function() {
      authApiService.api().login(vm.user, function(user) {
        historyService.goPrevious();
      }, (err) => {
        err.config.data.$$saving = false;
        vm.forms.loginForm.username.$setValidity('wrongCreds', false)
        vm.forms.loginForm.password.$setValidity('wrongCreds', false)
      })
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    vm.reset = function(elem, validator) {
      formService.resetValidity(elem, validator);
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
