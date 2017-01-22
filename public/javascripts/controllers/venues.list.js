// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('venuesListCtrl', venuesListCtrl);

  venuesListCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'permissionsService'];

  function venuesListCtrl($filter, $state, $stateParams, venuesService, permissionsService) {

    var vm = this;

    vm.errors = [];

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.newVenue = function() {
      $state.transitionTo('venues.manage');
    }

    vm.viewVenue = function(venue) {
      $state.transitionTo('venues.view', {
        id: venue._id
      });
    }

    vm.editVenue = function(venue) {
      $state.transitionTo('venues.manage', {
        id: venue._id
      });
    }

    vm.removeVenue = function(venue) {
      venuesService.api(venue._id).remove(function() {
        vm.getVenues();
      });
    }

    function initialize() {
      vm.getVenues();
      $stateParams.reason ? vm.errors.push($stateParams.reason) : angular.noop;
    }

    initialize();

  }

})(angular);
