// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('statsPlayersCtrl', statsPlayersCtrl);

  statsPlayersCtrl.$inject = ['$filter', '$state', '$stateParams', 'statsService', 'usersService', 'playersService', 'venuesService'];

  function statsPlayersCtrl($filter, $state, $stateParams, statsService, usersService, playersService, venuesService) {

    var vm = this;

    function initialize() {
      if ($stateParams.id) {
        vm.playerStats = statsService.api($stateParams.id).seasons();
      } else {
        vm.playerStats = statsService.api().players();
      }
    }

    initialize();

  }

})(angular);
