// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('venuesListCtrl', venuesListCtrl);

  venuesListCtrl.$inject = [ '$filter', '$state', '$stateParams', 'venuesService' ];

  function venuesListCtrl($filter, $state, $stateParams, venuesService) {
    
    var vm = this;

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.viewVenue = function(venue) {
      vm.selectedTab = 2;
      $state.transitionTo('venues.view', { id : venue._id });
    }

    vm.editVenue = function(venue) {
      vm.selectedTab = 1;
      $state.transitionTo('venues.manage', { id : venue._id });
    }

    vm.removeVenue = function(venue) {
      venuesService.api(venue._id).remove(function() {
        vm.getVenues();
      });
    }

    function initialize() {
      vm.getVenues();
    }

    initialize();

  }    

})(angular);