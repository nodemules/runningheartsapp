// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('seasonsCtrl', seasonsCtrl);

  seasonsCtrl.$inject = ['$filter', '$state', 'seasonsService'];

  function seasonsCtrl($filter, $state, seasonsService) {

    var vm = this;

    function initialize() {}

    initialize();

  }

})(angular);
