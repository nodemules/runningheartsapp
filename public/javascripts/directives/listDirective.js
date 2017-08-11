// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).directive('rhpList', rhpListDirective);

  rhpListDirective.$inject = ['$mdMedia'];

  function rhpListDirective($mdMedia) {

    var rhpListTemplate = [
      '<md-content layout="column">', //
      '  <md-button class="md-secondary" ng-disabled="list.listIndex == 0" aria-label="last-four-list" ng-click="list.last()">', //
      '    Last {{list.size}} list', //
      '  </md-button>', //
      '  <md-input-container class="rhp-search-input" flex-gt-xs="80" flex-xs="65">', //
      '    <label>{{list.getEntityName(list.entityType)}} search</label>', //
      '    <input ng-model="listSearch" name="name" ng-change="list.first()" />', //
      '  </md-input-container>', //
      '  <md-list class="md-dense" ng-class="{ \'rhp-dense-list\':list.mdMedia(\'xs\') }" ng-repeat="item in list.list | filter: listSearch | orderBy: list.sort | limitTo:list.size:list.listIndex">', //
      '    <md-list-item class="md-3-line md-hue-1" ng-click="list.setItem({item : item})">', //
      '      <div class="md-list-item-text">', //
      '        <h3 ng-if="item.name">{{item.name}}</h3>', //  TODO - Figure out how to standardize
      '        <h3 ng-if="item.venue">{{item.venue.name}}</h3>', //
      '        <p ng-if="item.day || item.date">{{item.day ? item.day : (item.date | date:\'fullDate\')}} at {{item.time ? item.time : item.venue.time}}</p>', //     TODO - this based on a scope import
      '        <p ng-if="item.td">',
      '          <span ng-repeat="td in item.td">',
      '            {{($index + 1) == item.td.length && item.td.length > 1 ? \'and/or \' : \'\'}}{{td.name}}{{($index + 1) < item.td.length ? \', \' : \'\'}}',
      '          </span>',
      '        </p>', // TODO - from the directive attribute
      '        <p ng-if="item.isTd">{{item.isTd ? \'Tournament Director\' : \'\'}}</p>', //
      '      </div>', //
      '      <md-button class="md-warn md-icon-button md-secondary" ng-click="list.editItem({item : item})" ng-if="list.canEdit(list.entityType)">', //
      '        <md-icon md-font-set="material-icons">edit</md-icon>', //
      '      </md-button>', //
      '      <md-button class="md-warn md-icon-button md-secondary" ng-click="list.removeItem({item : item}); $event.stopPropagation()" ng-if="list.canDelete(list.entityType)">', //
      '        <md-icon md-font-set="material-icons">clear</md-icon>', //
      '      </md-button>', //
      '    </md-list-item>', //
      '  </md-list>', //
      '  <md-button class="md-secondary" aria-label="more-list" ng-click="list.list.length > list.listIndex + list.size ? list.next() : list.first()">', //
      '    {{ list.list.length > list.listIndex + list.size ? \'And \' + (list.list.length - list.listIndex - list.size) + \' more...\' : \'Back to Start\' }}', //
      '  </md-button>', //
      '</md-content>'
    ].join('');

    var directive = {
      restrict: 'E',
      template: rhpListTemplate,
      scope: {
        list: '=ngModel',
        size: '=rhpListSize',
        sort: '=rhpListSort',
        setItem: '&rhpListSet',
        editItem: '&rhpListEdit',
        removeItem: '&rhpListDel',
        entityType: '='
      },
      bindToController: true,
      controller: ctrlFn,
      controllerAs: 'list'
    }

    return directive;

    ctrlFn.$inject = ['$scope', '$mdMedia', '$timeout', 'permissionsService', 'Entities'];

    function ctrlFn($scope, $mdMedia, $timeout, permissionsService, Entities) {

      var vm = this;

      vm.mdMedia = $mdMedia;
      vm.permissions = {};

      var userPermissions = {};

      function getPermissions() {
        permissionsService.getPermissions((permissions) => {
          userPermissions = permissions;
        })
      }

      vm.canEdit = function(entityType) {
        switch (entityType) {
          case Entities.PLAYER:
            return userPermissions.EDIT_PLAYER;
          case Entities.VENUE:
            return userPermissions.EDIT_VENUE;
          case Entities.EVENT:
            return userPermissions.EDIT_EVENT;
          default:
            return false;
        }
      }

      vm.getEntityName = function(entityType) {
        return Object.keys(Entities).find(key => Entities[key] === entityType).toLowerCase();
      }

      vm.canDelete = function(entityType) {
        switch (entityType) {
          case Entities.PLAYER:
            return userPermissions.DELETE_PLAYER;
          case Entities.VENUE:
            return userPermissions.DELETE_VENUE;
          case Entities.EVENT:
            return userPermissions.DELETE_EVENT;
          default:
            return false;
        }
      }

      function initialize() {
        vm.first();
        getPermissions();
      }

      vm.next = function() {
        vm.listIndex += vm.size;
      }

      vm.last = function() {
        vm.listIndex += -vm.size;
      }

      vm.first = function() {
        vm.listIndex = 0;
      }

      initialize();
    }

  }

})(angular);
