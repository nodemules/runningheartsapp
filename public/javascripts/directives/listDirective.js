// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).directive('rhpList', rhpListDirective);

  rhpListDirective.$inject = [ '$mdMedia' ];

  function rhpListDirective($mdMedia) {

    var rhpListTemplate = [
      '<md-content layout="column">', //
      '  <md-button class="md-secondary" ng-disabled="list.listIndex == 0" aria-label="last-five-list" ng-click="list.last5()">', //
      '    Last 5 list', //
      '  </md-button>', //
      '  <md-list class="md-dense" ng-class="{ \'rhp-dense-list\':list.mdMedia(\'xs\') }" ng-repeat="item in list.list | limitTo:5:list.listIndex">', //
      '    <md-list-item class="md-3-line md-hue-1" ng-click="list.doSetItem(item)">', //
      '      <div class="md-list-item-text">', //
      '        <h3>{{item.name}}</h3>', //  TODO - Figure out how to standardize 
      '        <p>{{item.day}}</p>', //     TODO - this based on a scope import
      '        <p>{{item.td.name}}</p>', // TODO - from the directive attribute
      '      </div>', //
      '      <md-button class="md-warn md-icon-button" ng-click="list.removeItem(item)">', //
      '        <md-icon md-font-set="material-icons">clear</md-icon>', //
      '      </md-button>', //
      '    </md-list-item>', //
      '  </md-list>', //
      '  <md-button class="md-secondary" aria-label="more-list" ng-click="list.list.length > list.listIndex + 5 ? list.next5() : list.first5()">', //
      '    {{ list.list.length > list.listIndex + 5 ? \'And \' + (list.list.length - list.listIndex - 5) + \' more...\' : \'Back to Start\' }}', //
      '  </md-button>', //
      '</md-content>'
    ].join('');

    var directive = {
      restrict: 'E',
      template : rhpListTemplate,
      scope : {
        list : '=ngModel',
        size : '=rhpListSize',
        setItem : '&rhpListSet',
        editItem : '&rhpListEdit',
        removeItem : '&rhpListDel'
      },
      bindToController: true,
      controller: ctrlFn,
      controllerAs: 'list'
    }

    return directive;

    ctrlFn.$inject = [ '$scope', '$timeout' ];

    function ctrlFn($scope, $mdMedia, $timeout) {

      var vm = this;

      vm.mdMedia = $mdMedia;

      function initialize() {
        vm.first5();
      }

      vm.doSetItem = function(item) {
        vm.setItem({item : item});
      }

      vm.doRemoveItem = function(item) {
        vm.removeItem({item : item})
      }

      vm.next5 = function() {
        vm.listIndex += vm.size;
      }

      vm.last5 = function() {
        vm.listIndex += -vm.size;
      }

      vm.first5 = function() {
        vm.listIndex = 0;
      }

      initialize();
    }

  }

})(angular);