// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = [ '$filter', '$state', '$mdMedia', 'playersService' ];

  function playersCtrl($filter, $state, $mdMedia, playersService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    function initialize() {
    }

    initialize();

  }    

})(angular);