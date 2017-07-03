/* global angular, APP_NAME */
{

  angular.module(APP_NAME).factory('navService', navService);

  navService.$inject = ['$rootScope', '$mdSidenav'];

  function navService($rootScope, $mdSidenav) {

    const REFRESH_NAV_DATA = 'REFRESH_NAV_DATA';

    var service = {
      mainMenu,
      refreshNavData,
      onRefreshNavData
    }

    return service;

    /////////////////////

    function mainMenu(asyncx) {
      var sideNav;
      sideNav = $mdSidenav('appSidenav', asyncx);
      return {
        toggle: function(refresh) {
          return sideNav.toggle().then(() => {
            if (refresh && sideNav.isOpen()) {
              refreshNavData();
            }
          });
        },
        nav: function() {
          return sideNav;
        }
      }
    }

    function refreshNavData(data) {
      $rootScope.$broadcast(REFRESH_NAV_DATA, data);
    }

    function onRefreshNavData(scope, handler) {
      scope.$on(REFRESH_NAV_DATA, (e, data) => {
        try {
          handler(data);
        } catch (e) {
          console.error(e);
        }
      })
    }

  }

}
