// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('playersManageCtrl', playersManageCtrl);

  playersManageCtrl.$inject = [ '$filter', '$state', '$stateParams', 'playersService' ];

  function playersManageCtrl($filter, $state, $stateParams, playersService) {
    
    var vm = this;

    vm.getPlayer = function(id) {
      vm.player = playersService.api(id).get();
    }

    vm.save = function() {
      playersService.api().save(vm.player, function() {
        $state.transitionTo('players.list');
      })
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id);
      }
    }

    initialize();

  }    

})(angular);