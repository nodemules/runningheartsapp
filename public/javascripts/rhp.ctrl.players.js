(function() {
  'use strict';

  angular
    .module('runningHeartsPoker')
    .controller('rhpPlayerCtrl', rhpPlayerCtrl);

    rhpPlayerCtrl.$inject = [ '$scope', '$http' ];

    function rhpPlayerCtrl ($scope, $http) {

      function getPlayers() {
        $http.get('/api/players')
          .success(function(data) {  //change to then?
            $scope.players = data;
        })
      }



      getPlayers();
      
      }


})();