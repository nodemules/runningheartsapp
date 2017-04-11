{

  angular.module(APP_NAME).factory('historyService', historyService);

  historyService.$inject = ['$rootScope', '$state'];

  function historyService($rootScope, $state) {

    var service = {
      goPrevious,
      pushState,
      hasHistory
    }

    var stateHistory = [];

    function hasHistory() {
      return !!stateHistory && stateHistory.length != 0;
    }

    function goPrevious() {
      var previousState = stateHistory[stateHistory.length - 1];
      if (previousState && previousState.state.redirectTo) {
        previousState = stateHistory[stateHistory.length - 2];
      }
      if (!previousState) {
        previousState = {
          state: 'home',
          params: {}
        }
      }
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
