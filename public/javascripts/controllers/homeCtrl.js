{
  /* global angular, APP_NAME, moment */
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

    vm.card = {
      showRecentEvents: true,
      showUpcomingEvents: true
    };

    vm.refresh = function() {
      $state.go($state.current, {}, {
        reload: true
      });
    };

    vm.back = function() {
      historyService.goPrevious();
    };

    vm.toggleMenu = function() {
      navService.mainMenu().toggle(true, entityService.getChangedEntites());
    };

    vm.dayOfEvent = function(date) {
      return moment(new Date(date)).format('dddd, MMMM Do YYYY LT');
    };

    function getTodaysEvents() {
      vm.todaysEvents = eventsService.api().byDate({
        startDate: new Date()
      });
    }

    function getRecentEvents() {
      vm.recentEvents = eventsService.api().byDate({
        startDate: moment().subtract(2, 'weeks').toDate(),
        endDate: moment().subtract(1, 'days').toDate()
      });
    }

    function getUpcomingEvents() {
      vm.upcomingEvents = eventsService.api().byDate({
        startDate: moment().add(1, 'days').toDate(),
        endDate: moment().add(2, 'weeks').toDate()
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
      getRecentEvents();
      getUpcomingEvents();
    }

    initialize();



  }

}
