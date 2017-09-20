{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).directive('rhpNameList', rhpNameList);

  rhpNameList.$inject = [];

  function rhpNameList() {

    var directive = {
      restrict: 'E',
      templateUrl: '../views/templates/list/nameList.html',
      scope: {
        list: '=ngModel'
      }
    };

    return directive;

  }

}
