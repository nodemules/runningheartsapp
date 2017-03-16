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
        vm.forms.registerForm.token.$setValidity('invalidToken', false)
      })
    }

    vm.reset = function(elem, validator) {
      elem.$setValidity(validator, true);
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
