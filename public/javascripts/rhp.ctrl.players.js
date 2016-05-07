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

      $scope.addPlayer = function() {
        var newPlayer = {
          playerName: $scope.formData.playerName,
          totalWins: 0,
          seasonWins: 0,
          totalPoints: 0,
          seasonPoints: 0,
          isTd: false,
        }
        //TODO: need to check if player name exists and reject if so
        $http.post('/api/players', newPlayer)
          .then(function(data){
            $scope.formData = {}
            //TODO: some sort of visual confirmation
          })

        //Create the user name 

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