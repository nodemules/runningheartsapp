// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('statsPlayersCtrl', statsPlayersCtrl);

  statsPlayersCtrl.$inject = [ '$filter', '$state', 'statsService', 'usersService', 'playersService', 'venuesService' ];

  function statsPlayersCtrl($filter, $state, statsService, usersService, playersService, venuesService) {
    
    var vm = this;
    
    function initialize() {
      console.log('I am a statsPlayersCtrl');
      vm.playerStats = statsService.api().players();
    }

    initialize();

  }    

})(angular);

