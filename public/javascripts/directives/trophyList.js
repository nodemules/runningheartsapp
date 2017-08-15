{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).directive('rhpTrophyList', rhpTrophy);

  rhpTrophy.$inject = [];

  function rhpTrophy() {

    var directive = {
      restrict: 'E',
      templateUrl: '../views/templates/trophy/trophyList.html',
      scope: {
        ranks: '=',
        vertical: '@'
      },
      replace: true
    }

    return directive;

  }

}
