(function() {
  'use strict';

  angular
    .module('runningHeartsPoker')
    .controller('rhpSuperAdminCtrl', rhpSuperAdminCtrl);

    rhpSuperAdminCtrl.$inject = [ '$scope', '$http' ];

    function rhpSuperAdminCtrl ($scope, $http) {
      $scope.tds = [];
      $scope.formData = {};

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
                getVenues();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      };

    $scope.loadValues = function(venueId){
        $http.get('/api/venues/' + venueId)
          .success(function(data) {  //change to then?
            $scope.editData = {
              name    : data.name,
              day     : data.day,
              td      : data.td,
              venueId : data._id
            }
        })
      }
    
    $scope.modifyVenue = function(venueId){
      $http.put('api/venues', $scope.editData)
        .then(function(data){
              getVenues();
              $scope.show = false;
        })
    }

    function getTds() {
      $http.get('/api/tds')
        .success(function(data) {  //change to then?
          $scope.tds = data;
          $scope.formData.td = $scope.tds[0];
        })
      }

      getTds();
      getVenues();
    }

})();