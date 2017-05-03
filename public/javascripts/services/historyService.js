{

  angular.module(APP_NAME).factory('historyService', historyService);

  historyService.$inject = ['$rootScope', '$state'];

  function historyService($rootScope, $state) {

    var service = {
      goPrevious,
      isGoingBack,
      pushState,
      hasHistory
    }

    var stateHistory = [];
    var goingBack = false;

    function hasHistory() {
      return !!stateHistory && stateHistory.length != 0;
    }

    function goPrevious() {

      var previousState = stateHistory[stateHistory.length - 1];
      var hasRedirect = previousState && previousState.state.redirectTo;

      while (previousState && $state.current.name === previousState.state.name) {
        stateHistory.pop();
        previousState = stateHistory[stateHistory.length - 1];
      }

      if (hasRedirect) {
        previousState = stateHistory[stateHistory.length - 2];
      }
      if (!previousState) {
        previousState = {
          state: 'home',
          params: {}
        }
      } else if (hasRedirect) {
        stateHistory.slice(stateHistory.length - 2, 2);
      } else {
        stateHistory.pop();
      }

      goingBack = true;
      $state.go(previousState.state, previousState.params).then(() => {
        goingBack = false;
      });
    }

    function isGoingBack() {
      return goingBack;
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
