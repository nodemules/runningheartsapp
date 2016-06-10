// global angular
(function(angular) {

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [ '$filter', '$mdSidenav' ];

  function homeCtrl($filter, $mdSidenav) {
    vm = this;

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
        alert : "3 upcoming events"
      },
      {
        id : 2,
        label : "Venues",
        message : "Check out active venues",
        alert : "2 venues with notifications"
      },
      {
        id : 3,
        label : "Players",
        message : "View player information",
        alert : "6 players with new data!"
      }
    ];

    vm.selectTab = function(id) {
      vm.activeTab = $filter('filter')(vm.tabs, { id: id })[0];
      vm.toggleMenu();
    }

    vm.toggleMenu = function() {
      $mdSidenav('appSidenav').toggle();
    }

  }

})(angular);