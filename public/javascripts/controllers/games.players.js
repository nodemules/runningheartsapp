{
  /* global APP_NAME, angular */

  angular.module(APP_NAME).controller('gamesPlayersCtrl', gamesPlayersCtrl);

  gamesPlayersCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'playersService', 'gamesService', 'errorService'];

  function gamesPlayersCtrl($filter, $state, $stateParams, $mdMedia, playersService, gamesService, errorService) {

    var vm = this;

    vm.game = {};

    vm.forms = {};

    vm.mdMedia = $mdMedia;

    vm.getGame = function(gameId) {
      vm.game = gamesService.api(gameId).get(function() {
        vm.game.newGame = vm.game.players.length === 0;
        vm.getPlayers();
      });
    };

    vm.getPlayers = function() {
      var players = [];
      angular.forEach(vm.game.players, function(player) {
        players.push(player.player._id);
      });
      if (!vm.game.inProgress) {
        vm.players = playersService.api().query(function() {
          ready();
        });
      } else {
        vm.players = playersService.api().notIn({
          players: players
        }, function() {
          ready();
        });
      }
    };

    vm.isSelected = function(player) {
      var attendee = $filter('filter')(vm.game.players, {
        player: {
          _id: player._id
        }
      })[0];
      var idx = vm.game.players.indexOf(attendee);
      var selected = false;
      if (idx != -1) {
        selected = true;
      }
      return selected;
    };

    vm.toggleSelection = function(player) {
      var attendee = $filter('filter')(vm.game.players, {
        player: {
          _id: player._id
        }
      })[0];
      var idx = vm.game.players.indexOf(attendee);
      if (idx > -1) {
        vm.game.players.splice(idx, 1);
      } else {
        vm.game.players.push({
          player: player
        });
      }
    };

    vm.addPlayersToGame = function() {
      gamesService.api().save(vm.game, function() {
        $state.transitionTo('games.view', {
          id: vm.game._id
        });
      }, function(err) {
        errorService.handleApiError(err);
      });
    };

    vm.validatePlayerName = function(player) {
      vm.forms.playerAddForm.name.$setValidity('nameTaken', true);
      if (!player || !player.name) {
        return;
      }
      playersService.api().validate(player, angular.noop, (err) => {
        switch (err.data.code) {
          case 'PLAYER_NAME_TAKEN':
            err.config.data.$$saving = false;
            vm.forms.playerAddForm.name.$setValidity('nameTaken', false);
            break;
          default:
            errorService.handleApiError(err);
            break;
        }
      });
    };

    vm.createPlayer = function(player) {
      playersService.api().save(player, function(resPlayer) {
        vm.getPlayers(true);
        vm.game.players.push({
          player: resPlayer
        });
        player.name = null;
      }, function(err) {
        errorService.handleApiError(err);
      });
    };

    function ready() {
      vm.ready = true;
    }

    function initialize() {
      vm.getGame($stateParams.gameId);
    }

    initialize();

  }

}
