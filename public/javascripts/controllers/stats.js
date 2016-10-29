// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('statsCtrl', statsCtrl);

  statsCtrl.$inject = [ '$filter', '$state', 'statsService', 'usersService', 'playersService', 'venuesService' ];

  function statsCtrl($filter, $state, statsService, usersService, playersService, venuesService) {
    
    var vm = this;

    function initialize() {
      console.log('I am a statsCtrl')
    }

    initialize();

  }    

})(angular);

