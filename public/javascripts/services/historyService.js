{

  angular.module(APP_NAME).factory('historyService', historyService);

  historyService.$inject = ['$rootScope', '$state'];

  function historyService($rootScope, $state) {

    var service = {
      goPrevious,
      pushState
    }

    var stateHistory = [];

    function goPrevious() {
      var previousState = stateHistory[stateHistory.length - 1];
      previousState = !previousState ? {
        state: 'home',
        params: {}
      } : previousState;
      $state.go(previousState.state, previousState.params);
    }

    function pushState(fromState, fromParams) {
      stateHistory.push({
        state: fromState,
        params: fromParams
      });
    }

    return service;

  }

}
