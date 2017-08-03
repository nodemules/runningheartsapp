{
  /* global APP_NAME, angular */
  angular.module(APP_NAME).controller('eventsManageCtrl', eventsManageCtrl);

  eventsManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'usersService', 'playersService', 'venuesService', 'historyService', 'formService', 'errorService', 'permissionsService'];

  function eventsManageCtrl($filter, $state, $stateParams, eventsService, usersService, playersService, venuesService, historyService, formService, errorService, permissionsService) {

    var vm = this;

    vm.forms = {};
    vm.permissions = {};
    vm.event = {};
    vm.directors = [];

    vm.getDirectors = function() {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    }

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.resetEvent = function() {
      vm.event = {};
    }

    vm.reset = function(elem, validator) {
      formService.resetValidity(elem, validator);
    }

    vm.save = function() {
      eventsService.api().save(vm.event, function() {
        $state.transitionTo('events.list')
      }, (err) => {
        switch (err.data.code) {
          case 'EVENT_ALREADY_EXISTS':
            err.config.data.$$saving = false; //$$saving isn't getting set back to false on error for some reason
            vm.forms.manageEvent.date.$setValidity('eventAlreadyExists', false)
            break;
          default:
            errorService.handleApiError(err);
            break;
        }
      });
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    vm.getEvent = function(id) {
      eventsService.api(id).get(function(event) {
        event.date = new Date(event.date);
        vm.event = event;
      });
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        $state.transitionTo('events.list')
      });
    }

    vm.canCreateEvent = function(date) {
      return vm.permissions.CREATE_ANY_EVENT || date >= new Date();
    }

    function getPermissions() {
      permissionsService.getPermissions((permissions) => {
        vm.permissions = permissions
      });
    }

    function initialize() {
      getPermissions();
      vm.getDirectors();
      vm.getVenues();
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();

  }

}
