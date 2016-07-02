// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('venuesViewCtrl', venuesViewCtrl);

  venuesViewCtrl.$inject = [ '$filter', '$state', '$stateParams', 'venuesService', 'playersService' ];

  function venuesViewCtrl($filter, $state, $stateParams, venuesService, playersService) {
    
    var vm = this;

    vm.venue = {};

    vm.getVenue = function(id) {
      vm.venue = venuesService.api(id).get();
    }

    vm.removeVenue = function(venue) {
      venuesService.api(venue._id).remove(function() {
        $state.go('venues.list')
      });
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getVenue($stateParams.id);
      }
    }

    initialize();

  }    

})(angular);