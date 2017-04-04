// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'usersService', 'historyService', 'formService'];

  function registerCtrl($state, usersService, historyService, formService) {

    var vm = this;

    vm.register = function() {
      usersService.api().save(vm.user, function() {
        $state.transitionTo('home'); //change to 'admin console' when the time comes
      }, (err) => {
        switch (err.data.code) {
          case 'INVALID_TOKEN':
            err.config.data.$$saving = false;
            vm.forms.registerForm.token.$setValidity('invalidToken', false)
            break;
          case 'DUPLICATE_KEY_ERROR':
            err.config.data.$$saving = false;
            vm.forms.registerForm.username.$setValidity('userTaken', false)
            break;
          default:
            break;
        }

      })
    }

    vm.reset = function(elem, validator) {
      formService.resetValidity(elem, validator);
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
