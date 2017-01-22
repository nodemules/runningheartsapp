{
  /* global angular, APP_NAME */
  'use strict';

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = [
    '$filter', '$state', '$scope', '$mdSidenav', '$mdMedia', '$q',
    'eventsService', 'playersService', 'seasonsService', 'statsService',
    'venuesService', 'gamesService', 'permissionsService', 'authApiService'
  ];

  function homeCtrl(
    $filter, $state, $scope, $mdSidenav, $mdMedia, $q,
    eventsService, playersService, seasonsService, statsService,
    venuesService, gamesService, permissionsService, authApiService
  ) {

    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.messages = {};

    vm.loadTabs = function() {

      return $q.all([
        eventsService.api().count().$promise,
        venuesService.api().count().$promise,
        playersService.api().count().$promise,
        seasonsService.api().query().$promise,
        statsService.api().players().$promise
      ])
        .then(function(result) {
          vm.messages = {
            events: result[0].count,
            venues: result[1].count,
            players: result[2].count,
            seasons: result[3].length,
            stats: result[4][0] ? result[4][0].name : 'No one'
          }
          vm.tabs = [{
            id: 0,
            label: 'Login',
            message: 'Admins Login Here',
            path: 'login'
          }, {
            id: 1,
            label: 'Home',
            message: 'This is the home page',
            path: 'home'
          }, {
            id: 2,
            label: 'Events',
            message: 'See upcoming events',
            alert: vm.messages.events + ' Total Events',
            path: 'events'
          }, {
            id: 3,
            label: 'Venues',
            message: 'Check out active venues',
            alert: vm.messages.venues + ' Total Venues',
            path: 'venues'
          }, {
            id: 4,
            label: 'Players',
            message: 'View player information',
            alert: vm.messages.players + ' Total Registered Players',
            path: 'players'
          }, {
            id: 5,
            label: 'Standings',
            message: 'View Player Standings',
            alert: vm.messages.stats + ' is currently leading!',
            path: 'stats'
          }, {
            id: 6,
            label: 'Seasons',
            message: 'View Season information',
            alert: 'We are Currently in Season ' + vm.messages.seasons,
            path: 'seasons.view'
          }, {
            id: -1,
            label: 'Logout',
            message: 'Logout of the application',
            path: 'home',
            options: {
              reload: true
            }
          }];
          vm.activeTab = vm.tabs[0];
        })
    }

    vm.selectTab = function(tab) {
      if (tab.id === -1) {
        authApiService.api().logout(function() {
          $state.transitionTo(tab.path, {}, {
            reload: true
          });
        });
        return vm.toggleMenu();
      }
      vm.activeTab = tab;
      $state.go(tab.path, tab.params, tab.options);
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

    function getPermissions() {
      permissionsService.getPermissions((permissions) => {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();



  }

}
