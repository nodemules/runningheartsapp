/* global angular, APP_NAME */
{

  angular.module(APP_NAME).factory('navService', navService);

  navService.$inject = ['$mdSidenav', 'eventsService', 'venuesService', 'playersService', 'seasonsService', 'statsService'];

  function navService($mdSidenav, eventsService, venuesService, playersService, seasonsService, statsService) {

    var service = {
      mainMenu
    }

    return service;

    /////////////////////

    function mainMenu(asyncx) {
      var sideNav;
      sideNav = $mdSidenav('appSidenav', asyncx);
      return {
        toggle: function() {
          return sideNav.toggle();
        },
        nav: function() {
          return sideNav;
        }
      }
    }

  }

}
