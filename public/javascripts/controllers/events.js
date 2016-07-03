// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = [ '$filter', '$state', '$mdMedia', 'eventsService', 'usersService', 'playersService', 'venuesService' ];

  function eventsCtrl($filter, $state, $mdMedia, eventsService, usersService, playersService, venuesService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    function initialize() {
    }

    initialize();

  }    

})(angular);