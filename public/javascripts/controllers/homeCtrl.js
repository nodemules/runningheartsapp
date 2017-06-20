{
  /* global angular, APP_NAME */
  'use strict';

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$filter', '$state', '$scope', '$mdSidenav', '$mdMedia', '$q',
    'eventsService', 'playersService', 'seasonsService', 'statsService',
    'venuesService', 'gamesService', 'permissionsService', 'authApiService',
    'authService', 'dialogService', 'historyService'
  ];

  function homeCtrl(
    $filter, $state, $scope, $mdSidenav, $mdMedia, $q,
    eventsService, playersService, seasonsService, statsService,
    venuesService, gamesService, permissionsService, authApiService,
    authService, dialogService, historyService
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
      $mdSidenav('appSidenav').toggle();
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
