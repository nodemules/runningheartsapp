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
      if (vm.showAllPlayers) {
        vm.players = playersService.api().query(function() {
          ready();
        });
      } else {
        vm.players = playersService.api().notIn({ players : players }, function() {
          ready();
        });
      }
    }

    vm.isSelected = function(player) {
      var attendee = $filter('filter')(vm.game.players, { player : { _id : player._id }  })[0];
      var idx = vm.game.players.indexOf(attendee);
      var selected = false;
      if (idx != -1) {
        selected = true;
      }
      return selected;
    }

    vm.toggleSelection = function(player) {
      var attendee = $filter('filter')(vm.game.players, { player : { _id : player._id }  })[0];
      var idx = vm.game.players.indexOf(attendee);
      if (idx > -1) {
        vm.game.players.splice(idx, 1);
      } else {
        vm.game.players.push({ player : player })
      }
    }

    vm.addPlayersToGame = function() {
      gamesService.api().save(vm.game, function() {
        $state.transitionTo('games.view', { id : vm.game._id })
      })
    }

    function ready() {
      vm.ready = true;
    }

    function initialize() {
      vm.getGame($stateParams.gameId);
    }

    initialize();
    
  }

})(angular);