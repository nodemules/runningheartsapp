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
      '    <md-list-item class="md-3-line md-hue-1" ng-click="list.setItem({item : item})">', //
      '      <div class="md-list-item-text">', //
      '        <h3 ng-if="item.name">{{item.name}}</h3>', //  TODO - Figure out how to standardize
      '        <h3 ng-if="item.venue">{{item.venue.name}}</h3>', // 
      '        <p>{{item.day ? item.day : (item.date | date:\'fullDate\') + \' \' + (item.date | date:\'shortTime\')}}</p>', //     TODO - this based on a scope import
      '        <p ng-if="item.td">{{item.td.name}}</p>', // TODO - from the directive attribute
      '        <p ng-if="item.isTd">{{item.isTd ? \'Tournament Director\' : \'\'}}</p>', //
      '      </div>', //
      '      <md-button class="md-warn md-icon-button" ng-click="list.editItem({item : item})">', //
      '        <md-icon md-font-set="material-icons">edit</md-icon>', //
      '      </md-button>', //
      '      <md-button class="md-warn md-icon-button" ng-click="list.removeItem({item : item}); $event.stopPropagation()">', //
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