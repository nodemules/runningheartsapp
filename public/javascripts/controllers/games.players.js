{
  /* global APP_NAME, angular */

  angular.module(APP_NAME).controller('gamesPlayersCtrl', gamesPlayersCtrl);

  gamesPlayersCtrl.$inject = ['$filter', '$state', '$timeout', '$stateParams', 'playersService', 'gamesService',
    'errorService', 'Utils'
  ];

  function gamesPlayersCtrl($filter, $state, $timeout, $stateParams, playersService, gamesService, errorService,
    Utils) {

    var vm = this;

    vm.game = {};
    vm.forms = {};
    vm.list = {
      topIndex: 0
    };

    vm.getGame = function(gameId) {
      vm.game = gamesService.api(gameId).get(function() {
        vm.originalPlayers = angular.copy(vm.game.players);
        vm.getPlayers();
      });
    };

    vm.getPlayers = function() {
      playersService.api().query(function(players) {
        vm.players = players;
      });
    };

    vm.isExistingPlayer = function(player) {
      return !!Utils.arrays(vm.originalPlayers).findOne({
        player: {
          _id: player._id
        }
      });
    };

    vm.toggleSelection = function(player) {
      var attendee = {
        player: {
          _id: player._id
        }
      };
      Utils.arrays(vm.game.players).addOrRemove(attendee);
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
      playersService.api().save(player, (p) => {
        var attendee = {
          player: p
        };
        vm.game.players.push(attendee);
        delete player.name;
        vm.players.push(p);
        $timeout(() => {
          vm.list.topIndex = Utils.arrays(vm.players).orderedIndexOf('name', {
            _id: p._id
          });
        });
      }, function(err) {
        errorService.handleApiError(err);
      });
    };

    function initialize() {
      vm.getGame($stateParams.gameId);
    }

    initialize();

  }

}
