// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('gamesPlayersCtrl', gamesPlayersCtrl);

  gamesPlayersCtrl.$inject = [ '$filter', '$state', '$stateParams', '$mdMedia', 'playersService', 'gamesService'];

  function gamesPlayersCtrl($filter, $state, $stateParams, $mdMedia, playersService, gamesService) {

    var vm = this;

    vm.game = {};

    vm.mdMedia = $mdMedia;

    vm.getGame = function(gameId) {
      vm.game = gamesService.api(gameId).get(function() {

      vm.getPlayers();
      });
    }

    vm.getPlayers = function() {
      var ids = [];
      angular.forEach(vm.game.players, function(player) {
        ids.push(player.player._id);
      })
      vm.players = playersService.api().query(function() {
        angular.forEach(vm.players, function(player) {
          player.selected = ids.indexOf(player._id) != -1;
          console.log(player);
        })
      });
    }

    vm.addPlayersToGame = function() {
      var players = $filter('filter')(vm.players, { selected : true })
      vm.game.players = [];
      angular.forEach(players, function(player) {
        vm.game.players.push({ player : player })
      })
      gamesService.api().save(vm.game, function() {
        $state.transitionTo('games.play', { id : vm.game._id })
      })
    }

    function initialize() {
      vm.getGame($stateParams.gameId);
    }

    initialize();
    
  }

})(angular);