// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('gamesViewCtrl', gamesViewCtrl);

  gamesViewCtrl.$inject = [ '$state', '$stateParams', 'gamesService' ];

  function gamesViewCtrl($state, $stateParams, gamesService) {

    var vm = this;

    vm.getGame = function(id) {
      vm.game = gamesService.api(id).get();
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getGame($stateParams.id);
      }
    }

    initialize();
    
  }

})(angular);