// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'usersService', 'historyService'];

  function registerCtrl($state, usersService, historyService) {

    var vm = this;

    vm.register = function() {
      usersService.api().save(vm.user, function() {
        $state.transitionTo('home'); //change to 'admin console' when the time comes
      }, (err) => {
        switch (err.data.code) {
          case 'INVALID_TOKEN':
            vm.forms.registerForm.token.$setValidity('invalidToken', false)
            break;
          case 'DUPLICATE_KEY_ERROR':
            vm.forms.registerForm.username.$setValidity('userTaken', false)
            break;
          default:
            break;
        }

      })
    }

    vm.reset = function(elem, validator) {
      if (elem.$invalid) {
        elem.$setValidity(validator, true);
      }
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
