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
      '$scope', '$q', '$mdSidenav', '$state', 'eventsService',
      'venuesService', 'playersService', 'seasonsService', 'statsService',
      'authService', 'dialogService', 'authApiService'
    ];

    function controllerFn($scope, $q, $mdSidenav, $state, eventsService,
      venuesService, playersService, seasonsService, statsService, authService,
      dialogService, authApiService) {

      $scope.loadTabs = function() {

        return $q.all([
          eventsService.api().count().$promise,
          venuesService.api().count().$promise,
          playersService.api().count().$promise,
          seasonsService.api().query().$promise,
          statsService.api().winners().$promise
        ])
          .then(function(result) {
            $scope.messages = {
              events: result[0].count,
              venues: result[1].count,
              players: result[2].count,
              seasons: result[3].length,
              stats: result[4].map(function(player) {
                return player.name
              })
            }
            var isLoggedIn = authService.isAuth();
            var loginTab = {
              id: 0,
              label: 'Login',
              message: 'Admins Login Here',
              path: 'login'
            }
            var logoutTab = {
              id: -1,
              label: 'Logout',
              message: 'Logout of the application',
              path: 'home',
              options: {
                reload: true
              }
            }
            var registerTab = {
              id: -2,
              label: 'Register',
              message: 'Click here to register',
              path: 'register'
            }
            $scope.tabs = [{
              id: 1,
              label: 'Home',
              message: 'This is the home page',
              path: 'home'
            }, {
              id: 2,
              label: 'Events',
              message: 'See upcoming events',
              alert: $scope.messages.events + ' Total Events',
              path: 'events'
            }, {
              id: 3,
              label: 'Venues',
              message: 'Check out active venues',
              alert: $scope.messages.venues + ' Total Venues',
              path: 'venues'
            }, {
              id: 4,
              label: 'Players',
              message: 'View player information',
              alert: $scope.messages.players + ' Total Registered Players',
              path: 'players'
            }, {
              id: 5,
              label: 'Standings',
              message: 'View Player Standings',
              alert: $scope.messages.stats + ' is currently leading!',
              path: 'stats'
            }, {
              id: 6,
              label: 'Seasons',
              message: 'View Season information',
              alert: 'We are Currently in Season ' + $scope.messages.seasons,
              path: 'seasons.view'
            }];
            if (isLoggedIn) {
              $scope.tabs.push(logoutTab)
            } else {
              $scope.tabs.unshift(registerTab);
              $scope.tabs.unshift(loginTab);
            }
          })
      }

      $scope.selectTab = function(tab) {
        if (tab.id === -1) {
          var message = 'Are you sure you want to logout?'
          return dialogService.confirm(message).then(() => {
            authApiService.api().logout(function() {
              $state.transitionTo(tab.path, {}, {
                reload: true
              });
            });
            return $scope.toggleMenu();
          })
        }
        $state.go(tab.path, tab.params, tab.options);
        $scope.toggleMenu();
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
