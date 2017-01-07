// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'usersService'];

  function registerCtrl($state, usersService) {

    var vm = this;

    vm.register = function() {
      usersService.api().save(vm.user, function() {
        $state.transitionTo('home'); //change to 'admin console' when the time comes
      })
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
