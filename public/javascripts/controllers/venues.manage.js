// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('venuesManageCtrl', venuesManageCtrl);

  venuesManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'playersService', 'historyService', 'formService'];

  function venuesManageCtrl($filter, $state, $stateParams, venuesService, playersService, historyService, formService) {

    var vm = this;

    vm.forms = {};

    vm.venue = {
      numberOfGames: 1
    }

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

    vm.cancel = function() {
      historyService.goPrevious();
    }

    vm.save = function() {
      //prevent a bug where user sets a td then unselects it is valid
      if (!vm.venue.td) {
        vm.forms.manageVenue.td.$setValidity('required', false)
        return false;
      }
      venuesService.api().save(vm.venue, function() {
        $state.go('venues.list')
      });
    }

    vm.reset = function(elem, validator) {
      formService.resetValidity(elem, validator);
    }

    vm.getVenue = function(id) {
      vm.venue = venuesService.api(id).get();
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
