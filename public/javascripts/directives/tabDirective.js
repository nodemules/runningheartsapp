// global angular
(function(angular) {
  angular.module(APP_NAME).directive('rhpTabs', rhpTabs);

  function rhpTabs() {

    var rhpTabsTemplate = [
      '<md-tabs ng-show="tabs.tabVisibility()" md-stretch-tabs="always" class="md-primary md-fixed" md-selected="tabs.selectedTab">', //
      '  <md-tab ng-click="tabs.tabPath(tab.path)" ng-repeat="tab in tabs.tabs">', //
      '    <md-tab-label>{{tab.name}}</md-tab-label>', //
      '  </md-tab>', //
      '</md-tabs>' //
    ].join('');

    var directive = {
      restrict: 'E',
      template: rhpTabsTemplate,
      scope: {},
      bindToController: true,
      controller: rhpTabsController,
      controllerAs: 'tabs'
    }
    return directive;

    rhpTabsController.$inject = ['$scope', '$state', '$filter', '$timeout', '$stateParams'];

    function rhpTabsController($scope, $state, $filter, $timeout, $stateParams) {

      var vm = this;

      vm.tabs = [];

      vm.tabVisibility = function() {
        return $state.current.name.split('.')[1] !== 'list';
      }

      vm.tabPath = function(path) {
        var pathArray = path.split('.');

        if ($stateParams.id) {
          $state.transitionTo(path, {
            id: $stateParams.id
          });
        } else if (pathArray[1] === 'list') {
          $state.transitionTo(path);
        }
      }

      function buildTabArray(state) {

        vm.tabs = [];
        var parent = state.parent;
        if (parent === 'home')
          return;

        var tabsTypes = ['List', 'View', 'Manage'];

        angular.forEach(tabsTypes, function(type) {
          var path = parent + '.' + type.toLowerCase();
          var tab = {
            name: type,
            path: path
          };

          vm.tabs.push(tab);
        })

        setActiveTab(state);

      }

      function setActiveTab(state) {

        var activeTab = $filter('filter')(vm.tabs, {
          path: state.name
        })[0];

        vm.selectedTab = vm.tabs.indexOf(activeTab);

      }

      $scope.$watch(function() {
        return $state.current;
      }, function(n, o) {
        if (n.parent == o.parent && vm.tabs.length && n.parent != 'home') {
          setActiveTab(n);
        } else {
          buildTabArray(n);
        }
      })

      function initialize() {}

      initialize();

    }

  }

})(angular);
