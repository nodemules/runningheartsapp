// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$filter', '$state', '$scope', '$mdSidenav', '$mdMedia', 'eventsService', 'playersService', 'seasonsService', 'statsService', 'venuesService'];

  function homeCtrl($filter, $state, $scope, $mdSidenav, $mdMedia, eventsService, playersService, seasonsService, statsService, venuesService) {

    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.messages = {};

    vm.getAllMessages = function(){
      vm.messages = {
        events  : eventsService.api().count(),
        venues  : venuesService.api().count(),
        players : playersService.api().count()
      }
    }

    vm.tabs = [{
      id: 0,
      label: "Home",
      message: "This is the home page",
      path: "home"
    }, {
      id: 1,
      label: "Events",
      message: "See upcoming events",
      alert: "3 upcoming events",
      path: "events"
    }, {
      id: 2,
      label: "Venues",
      message: "Check out active venues",
      alert: "2 venues with notifications",
      path: "venues"
    }, {
      id: 3,
      label: "Players",
      message: "View player information",
      alert: "6 players with new data!",
      path: "players"
    }, {
      id: 4,
      label: "Standings",
      message: "View Player Standings",
      alert: "Last Updated <date>",
      path: "stats"
    }, {
      id: 5,
      label: "Seasons",
      message: "View Season information",
      alert: "Storing season data since December 1, 3999BC",
      path: "seasons.view"
    }];

    vm.selectTab = function(tab) {
      vm.activeTab = tab;
      $state.go(tab.path);
      vm.toggleMenu();
    }

    vm.toggleMenu = function() {
      $mdSidenav('appSidenav').toggle();
    }

    vm.refresh = function() {
      $state.go($state.current, {}, {
        reload: true
      })
    }

    vm.activeTab = vm.tabs[0];

  }

})(angular);
