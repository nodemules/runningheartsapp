{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .directive('rhpSideNav', rhpSideNav);

  rhpSideNav.$inject = [];

  function rhpSideNav() {
    var directive = {
      templateUrl: '../views/templates/sideNav/nav.html',
      restrict: 'E',
      controller: controllerFn
    }

    return directive;

    controllerFn.$inject = [
      '$scope', '$mdSidenav', '$state', 'eventsService',
      'venuesService', 'playersService', 'seasonsService', 'statsService',
      'authService', 'dialogService', 'authApiService', 'navService'
    ];

    function controllerFn($scope, $mdSidenav, $state, eventsService,
      venuesService, playersService, seasonsService, statsService, authService,
      dialogService, authApiService, navService) {

      navService.onRefreshNavData($scope, (data) => {
        reloadData();
      })

      function handleData(param, data) {
        $scope.messages[param] = data;
      }

      function reloadData() {
        venuesService.api().count((data) => {
          handleData('venues', data);
        });
        eventsService.api().count((data) => {
          handleData('events', data);
        });
        playersService.api().count((data) => {
          handleData('players', data);
        });
        seasonsService.api().query((data) => {
          handleData('seasons', data);
        });
        statsService.api().winners((data) => {
          handleData('stats', data);
        });
      }

      $scope.loadTabs = function() {
        $scope.messages = {
          events: eventsService.api().count(),
          venues: venuesService.api().count(),
          players: playersService.api().count(),
          seasons: seasonsService.api().query(),
          stats: statsService.api().winners()
        }

      }

      $scope.isLoggedIn = function() {
        return authService.isAuth();
      }

      $scope.logout = function() {
        var message = 'Are you sure you want to logout?'
        return dialogService.confirm(message).then(() => {
          authApiService.api().logout(function() {
            $state.transitionTo('logout', {}, {
              reload: true
            });
          });
          return $scope.toggleMenu();
        })
      }


      $scope.toggleMenu = function() {
        $mdSidenav('appSidenav').toggle();
      }

      $scope.swipeOpen = function() {
        $mdSidenav('appSidenav').open();
      }

      $scope.swipeClose = function() {
        //unpredictable behavior so far
        //$mdSidenav('appSidenav').close();
      }

      function initialize() {
        $scope.loadTabs();
      }

      initialize();

    }

  }

}
