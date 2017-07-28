{
  /* global angular, APP_NAME */

  'use strict';

  angular.module(APP_NAME).controller('playersViewCtrl', playersViewCtrl);

  playersViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'playersService', 'statsService'];

  function playersViewCtrl($filter, $state, $stateParams, playersService, statsService) {

    var vm = this;

    vm.stats = {
      currentSeason: true,
      specificSeason: false,
      seasonNumber: null
    }

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
        vm.getPlayerStats(vm.stats.currentSeason);
      })
    }

    vm.getPlayerStatsForSeason = function(seasonNumber) {
      vm.stats.currentSeason = false;
      vm.stats.specificSeason = true;
      vm.stats.seasonNumber = seasonNumber;
      statsService.api(vm.player._id, seasonNumber).playerSeason((player) => {
        mergePlayerStats(player);
      });
    }

    vm.getPlayerStats = function(currentSeason) {
      vm.stats.currentSeason = currentSeason;
      vm.stats.specificSeason = false;
      if (currentSeason) {
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
      playersService.api(player._id).remove(function() {
        $state.transitionTo('players.list');
      });
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id, $stateParams.season);
      }
    }

    initialize();

  }

}
