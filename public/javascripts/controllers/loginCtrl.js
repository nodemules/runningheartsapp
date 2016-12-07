// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'authService'];

  function loginCtrl($state, authService) {

    var vm = this;

    vm.login = function() {
      authService.api().login(vm.user, function(user) {
        $state.transitionTo('home'); //change to 'admin console' when the time comes
      })
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
