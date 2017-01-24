// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'authApiService', 'historyService'];

  function loginCtrl($state, authApiService, historyService) {

    var vm = this;

    vm.login = function() {
      authApiService.api().login(vm.user, function(user) {
        historyService.goPrevious();
      })
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    function initialize() {

    }

    initialize();

  }

})(angular);
