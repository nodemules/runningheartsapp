// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

  gamesPlayCtrl.$inject = [ '$state', '$stateParams', 'gamesService'];

  function gamesPlayCtrl($state, $stateParams, gamesService) {

    var vm = this;

    vm.getGame = function(id) {
      vm.game = gamesService.api(id).get(function() {
        if (!vm.game.inProgress) {
          vm.game.inProgress = true;
          vm.game.$save();
        }
      });
    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();
    
  }

})(angular);