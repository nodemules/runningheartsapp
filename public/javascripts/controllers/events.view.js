// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('eventsViewCtrl', eventsViewCtrl);

  eventsViewCtrl.$inject = [ '$filter', '$state', '$stateParams', 'eventsService', 'playersService', 'venuesService' ];

  function eventsViewCtrl($filter, $state, $stateParams, eventsService, playersService, venuesService) {
    
    var vm = this;

    vm.getEvent = function(id) {
      vm.event = eventsService.api(id).get();
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        vm.getEvents();
      });
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getEvent($stateParams.id)
      }
    }

    initialize();

  }    

})(angular);