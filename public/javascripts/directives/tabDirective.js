// global angular
(function (angular) {
  angular.module(APP_NAME).directive('rhpTabs', rhpTabs);

  function rhpTabs () {

    var rhpTabsTemplate = [
      '<md-tabs md-stretch-tabs="always" class="md-primary md-fixed" md-selected="tabs.selectedTab">', //
      '  <md-tab ui-sref="{{tab.path}}" ng-repeat="tab in tabs.tabs">', //
      '    <md-tab-label>{{tab.name}}</md-tab-label>', //
      '  </md-tab>', //
      '</md-tabs>' //
    ].join('');

    var directive = {
      restrict: 'E',
      template: rhpTabsTemplate,
      scope : {
      },
      bindToController: true,
      controller: rhpTabsController,
      controllerAs: 'tabs'
    }
    return directive;

    rhpTabsController.$inject = [ '$scope', '$state', '$filter', '$timeout' ];

    function rhpTabsController ($scope, $state, $filter, $timeout) {

      var vm = this;

      vm.tabs = [];

      function buildTabArray(state) {

        vm.tabs = [];
        var parent = state.parent;
        if (parent === 'home')
          return;

        var tabsTypes = [ 'List', 'View', 'Manage' ];

        angular.forEach(tabsTypes, function(type) {
          var path = parent + '.' + type.toLowerCase();
          var tab = {
            name : type,
            path : path
          };

          vm.tabs.push(tab);
        })

        setActiveTab(state);

      }

      function setActiveTab(state) {

        var activeTab = $filter('filter')(vm.tabs, { path : state.name })[0];

        vm.selectedTab = vm.tabs.indexOf(activeTab);

      }

      $scope.$watch(function() {
        return $state.current;
      }, function(n,o) {
        if (n.parent == o.parent && vm.tabs.length && n.parent != 'home') {
          setActiveTab(n);
        } else {
          buildTabArray(n);
        }
      })

      function initialize() {
      }

      initialize();

    }

  }

})(angular);