// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('venuesManageCtrl', venuesManageCtrl);

  venuesManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'playersService'];

  function venuesManageCtrl($filter, $state, $stateParams, venuesService, playersService) {

    var vm = this;

    vm.venue = {};
    vm.directors = [];

    vm.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    vm.getDirectors = function() {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    }

    vm.newVenue = function() {
      vm.resetVenue();
      $state.transitionTo('venues.manage');
    }

    vm.resetVenue = function() {
      vm.venue = {};
    }

    vm.save = function() {
      venuesService.api().save(vm.venue, function() {
        $state.go('venues.list')
      });
    }

    vm.getVenue = function(id) {
      venuesService.api(id).get(function(venue) {
        venue.td = $filter('filter')(vm.directors, {
          _id: venue.td._id
        })[0];
        vm.venue = venue;
      });
    }

    vm.removeVenue = function(venue) {
      venuesService.api(venue._id).remove(function() {
        $state.go('venues.list')
      });
    }

    function initialize() {
      vm.getDirectors();
      if ($stateParams.id) {
        vm.getVenue($stateParams.id);
      }
    }

    initialize();

  }

})(angular);
