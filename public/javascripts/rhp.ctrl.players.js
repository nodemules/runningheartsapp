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

      $scope.makeTd = function(){
        var updateUser = { 
          user: $scope.formdata.tdSelect,
          usertype: 2
          }
        $http.put('/api/players', updateUser )
          .then(function(data){
            //TODO: some sort of visual confirmation
          })
      }

      getPlayers();
      
      }


})();