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
      var players = [];
      angular.forEach(vm.game.players, function(player) {
        players.push(player.player._id);
      })
      vm.players = playersService.api().notIn({ players : players});
    }

    vm.toggleSelection = function(player) {
      var attendee = $filter('filter')(vm.game.players, { player : { _id : player._id }  })[0];
      var idx = vm.game.players.indexOf(attendee);
      console.log(idx);
      if (idx > -1) {
        vm.game.players.splice(idx, 1);
        console.log(vm.game.players);
      } else {
        vm.game.players.push({ player : player })
      }
    }

    vm.addPlayersToGame = function() {
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