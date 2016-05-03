(function() {
  'use strict';

  angular
    .module('runningHeartsPoker')
    .controller('rhpServerCtrl', rhpServerCtrl);

    rhpServerCtrl.$inject = [ '$scope', 'config' ];

    function rhpServerCtrl ($scope, config) {
      $scope.config = config;
    }

})();