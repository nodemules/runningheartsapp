{
  /* global APP_NAME, angular */
  angular.module(APP_NAME).controller('gamesFinalTableCtrl', gamesFinalTableCtrl)

  gamesFinalTableCtrl.$inject = ['$filter', '$state', '$stateParams', 'gamesService', 'errorService']

  function gamesFinalTableCtrl($filter, $state, $stateParams, gamesService, errorService) {

    var vm = this;

    vm.getGame = function(id) {
      vm.game = gamesService.api(id).get();
    }

    vm.setFinalTablePlayers = function() {
      //TODO: RHP_88 if a player is one of the final table players and has a cashed out time, remove his cashed out time score and rank
      var notFinalTablePlayers = getNotFinalTablePlayers();

      var cashedOutPlayers = notFinalTablePlayers.length
      var totalPlayers = vm.game.players.length
      var finalTablePlayers = totalPlayers - cashedOutPlayers;

      if (totalPlayers > cashedOutPlayers + 8 || finalTablePlayers < 8) {
        return false;
      }

      angular.forEach(notFinalTablePlayers, function(player) {
        if (!player.cashedOutTime) {
          var idx = getNextRankOut();
          player.cashedOutTime = Date.now()
          player.rank = idx + 1
          player.score = 1
        }
      })
      vm.game.finalTable = true;
      vm.game.$save(function() {
        $state.go('games.play', {
          id: vm.game._id
        })
      }, function(err) {
        errorService.handleApiError(err);
      });
    }

    vm.selectionsComplete = function() {
      if (!vm.game || !vm.game.players) {
        return false;
      }
      return vm.game.players.length - getNotFinalTablePlayers().length === 8;
    }

    function getNotFinalTablePlayers() {
      return $filter('filter')(vm.game.players, {
        goingToFinalTable: '!'
      })
    }

    function getNextRankOut() {

      var unscoredPlayers = $filter('filter')(vm.game.players, {
        score: 1
      }, function(a, e) {
        return a < e || a === undefined;
      })
      return unscoredPlayers.length - 1;
    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();

  }

}
