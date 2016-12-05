// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'usersService'];

  function loginCtrl($state, usersService) {

    var vm = this;

    vm.login = function() {
      usersService.api().login({user: vm.user}, function() {
      $state.transitionTo('home'); //change to 'admin console' when the time comes
      })
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
