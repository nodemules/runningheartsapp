 {
   /* global angular, APP_NAME */
   angular.module(APP_NAME).directive('rhpTabs', rhpTabs);

   function rhpTabs() {

     var rhpTabsTemplate = [
       '<md-tabs ng-if="tabs.tabVisibility()" md-stretch-tabs="always" class="md-primary md-fixed" md-selected="tabs.selectedTab">', //
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

     rhpTabsController.$inject = ['$scope', '$q', '$state', '$filter', '$timeout', '$stateParams', 'permissionsService'];

     function rhpTabsController($scope, $q, $state, $filter, $timeout, $stateParams, permissionsService) {

       var vm = this;

       vm.tabs = [];

       vm.tabVisibility = function() {
         var currentState = $state.current.name.split('.')[1];
         return currentState !== 'list' && !(currentState === 'manage' && !$stateParams.id)
       }

       vm.tabPath = function(path) {

         var pathArray = path.split('.');

         if ($stateParams.id) {
           $state.transitionTo(path, {
             id: $stateParams.id,
             season: $stateParams.season,
             allTime: $stateParams.allTime
           });
         } else if (pathArray[1] === 'list') {
           $state.transitionTo(path);
         }
       }

       function buildTabArray(state) {

         vm.tabs = [];

         var tabsTypes = ['List', 'View'];

         $q.all([addManageTab(state.parent)]).then((data) => {
           tabsTypes.push('Manage');
           doTabStuff(tabsTypes, state);
         })

         doTabStuff(tabsTypes, state);

         if (state.parent === 'players') {
           var gamesTab = {
             name: 'Games',
             path: 'players.view.games'
           };
           vm.tabs.push(gamesTab);
         }

       }

       function doTabStuff(tabsTypes, state) {
         var parent = state.parent;
         if (parent === 'home')
           return;

         angular.forEach(tabsTypes, function(type) {
           var path = parent + '.' + type.toLowerCase();
           var tab = {
             name: type,
             path: path
           };

           var isTabInArray = !!$filter('filter')(vm.tabs, {
             path: tab.path
           })[0];
           if (!isTabInArray) {
             vm.tabs.push(tab);
           }
         })

         if (state) {
           setActiveTab(state);
         }

       }

       function setActiveTab(state) {

         var activeTab = $filter('filter')(vm.tabs, {
           path: state.name
         })[0];

         vm.selectedTab = vm.tabs.indexOf(activeTab);

       }

       function addManageTab(entity) {
         var permission;

         switch (entity.toUpperCase()) {
           case 'EVENTS':
             permission = 'EDIT_EVENT'
             break;
           case 'VENUES':
             permission = 'EDIT_VENUE'
             break;
           case 'PLAYERS':
             permission = 'EDIT_PLAYER'
             break;
           default:
             return false;

         }
         return permissionsService.checkPermissions([permission]);
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

 }
