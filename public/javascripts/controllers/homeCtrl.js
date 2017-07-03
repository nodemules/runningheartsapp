{
  /* global angular, APP_NAME */
  'use strict';

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$filter', '$state', '$scope', '$mdSidenav', '$mdMedia',
    'eventsService', 'permissionsService', 'authApiService',
    'authService', 'dialogService', 'historyService', 'navService', 'entityService'
  ];

  function homeCtrl(
    $filter, $state, $scope, $mdSidenav, $mdMedia,
    eventsService, permissionsService, authApiService,
    authService, dialogService, historyService, navService, entityService
  ) {

    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.messages = {};

    vm.refresh = function() {
      $state.go($state.current, {}, {
        reload: true
      })
    }

    vm.back = function() {
      historyService.goPrevious()
    }

    vm.toggleMenu = function() {
      navService.mainMenu().toggle(true, entityService.getChangedEntites());
    }

    function getTodaysEvents() {
      vm.todaysEvents = eventsService.api().byDate({
        startDate: new Date()
      });
    }

    function getPermissions() {
      permissionsService.getPermissions((permissions) => {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
      getTodaysEvents();
    }

    initialize();



  }

}
