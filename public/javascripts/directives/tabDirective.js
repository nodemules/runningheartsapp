// global angular
(function (angular) {
  angular.module(APP_NAME).directive('rhpTabs', rhpTabs);

  function rhpTabs () {

    var rhpTabsTemplate = [
      '<md-tabs md-dynamic-height md-selected="selectedTab">',
      '  <md-tab ng-repeat="t in tabs">',
      '    <md-tab-label>{{t.label}}</md-tab-label>',
      '    <md-tab-body>{{t.content}}</md-tab-body>',
      '  </md-tab>',
      '</md-tabs>'
    ].join('');

    var directive = {
      restrict: 'E',
      link: link,
      template: rhpTabsTemplate,
      controller: rhpTabsController
    }
    return directive;

    function link (scope, el, attrs) {
      scope.tabs = scope.$eval(attrs.tabs);
      console.log(attrs.tabs, scope.tabs);

    }

    rhpTabsController.$inject = [];

    function rhpTabsController () {
      
    }

  }

})(angular);