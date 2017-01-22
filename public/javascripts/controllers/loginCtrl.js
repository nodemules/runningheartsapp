// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'authApiService'];

  function loginCtrl($state, authApiService) {

    var vm = this;

    vm.login = function() {
      authApiService.api().login(vm.user, function(user) {
        $state.transitionTo('home', {}, {
          reload: true
        }); //change to 'admin console' when the time comes
      })
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
