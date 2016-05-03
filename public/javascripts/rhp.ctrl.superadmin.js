(function() {
  'use strict';

  angular
    .module('runningHeartsPoker')
    .controller('rhpSuperAdminCtrl', rhpSuperAdminCtrl);

    rhpSuperAdminCtrl.$inject = [ '$scope', '$http' ];

    function rhpSuperAdminCtrl ($scope, $http) {

      function getVenues() {
        $http.get('/api/venues')
          .success(function(data) {  //change to then?
            $scope.venues = data;
        })
      }
      
      $scope.createVenue = function() {
        $http.post('/api/venues', $scope.formData)
            .success(function(data) { //change to then?
                $scope.formData = {}; // clear the form after entry
                $scope.venues = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

      getVenues();
    }

})();