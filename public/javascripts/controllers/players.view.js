{
  /* global angular, APP_NAME */

  'use strict';

  angular.module(APP_NAME).controller('playersViewCtrl', playersViewCtrl);

  playersViewCtrl.$inject = [
    '$filter', '$state', '$stateParams', '$mdMedia', 'playersService', 'statsService', 'seasonsService',
    'dialogService', 'stateService'
  ];

  function playersViewCtrl($filter, $state, $stateParams, $mdMedia, playersService, statsService, seasonsService,
    dialogService, stateService) {

    var vm = this;

    vm.media = $mdMedia;

    vm.stats = {};

    function mergePlayerStats(player) {
      if (player.name) {
        vm.player = player;
      } else {
        vm.player = angular.copy(vm.originalPlayer);
      }
    }

    vm.getPlayer = function(id, seasonNumber) {
      vm.player = playersService.api(id).get(() => {
        vm.originalPlayer = angular.copy(vm.player);
        if (!vm.player._id) {
          return $state.transitionTo('players.list');
        }
        if (seasonNumber) {
          return vm.getPlayerStatsForSeason(seasonNumber);
        }
        vm.getPlayerStats();
      })
    }

    vm.getPlayerStatsForSeason = function(seasonNumber) {
      vm.stats.allTime = false;
      vm.stats.season = seasonsService.api(seasonNumber).get(() => {
        statsService.api(vm.player._id, vm.stats.season.seasonNumber).playerSeason((player) => {
          mergePlayerStats(player);
        });
      })
    }

    vm.getPlayerStats = function() {
      vm.stats.season = null;
      stateService.setParams({
        id: vm.player._id,
        allTime: vm.stats.allTime
      });
      if (!vm.stats.allTime) {
        statsService.api(vm.player._id).playerSeason((player) => {
          mergePlayerStats(player);
        });
      } else {
        statsService.api(vm.player._id).player((player) => {
          mergePlayerStats(player);
        });
      }
    }

    vm.shoutOut = function(id) {
      playersService.api(id).shoutOut(function(data) {
        vm.player.shoutOuts = data.shoutOuts;
      })
    }

    vm.save = function() {
      playersService.api().save(vm.player, function() {
        $state.transitionTo('players.list');
      })
    }

    vm.removePlayer = function(player) {
      dialogService.confirm('Are you sure you want to delete this player?').then(() => {
        playersService.api(player._id).remove(function() {
          $state.transitionTo('players.list');
        });
      });
    }

    function initialize() {
      if ($stateParams.id) {
        vm.stats.allTime = $stateParams.allTime;
        vm.getPlayer($stateParams.id, $stateParams.season);
      }
    }

    initialize();

  }

}
