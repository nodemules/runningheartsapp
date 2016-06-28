// global angular
(function(angular) {
  
  'use strict';
  
  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [ '$filter', '$mdSidenav', '$state', '$scope' ];

  function homeCtrl($filter, $mdSidenav, $state, $scope) {
    var vm = this;

    vm.activeTab = {
      id : 0,
      label : "Home",
      message : "This is the home page"
    }

    vm.tabs = [
      {
        id : 1,
        label : "Events",
        message : "See upcoming events",
        alert : "3 upcoming events",
        path: "events"
      },
      {
        id : 2,
        label : "Venues",
        message : "Check out active venues",
        alert : "2 venues with notifications",
        path: "venues"
      },
      {
        id : 3,
        label : "Players",
        message : "View player information",
        alert : "6 players with new data!",
        path: "players"
      }
    ];

    vm.selectTab = function(tab) {
      vm.activeTab = tab;
      $state.go(tab.path);
    console.log(tab);
      vm.toggleMenu();
    }

    vm.toggleMenu = function() {
      $mdSidenav('appSidenav').toggle();
    }

  }

})(angular);