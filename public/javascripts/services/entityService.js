/* global angular, APP_NAME */
{

  angular.module(APP_NAME).factory('entityService', entityService);

  entityService.$inject = ['Entities'];

  function entityService(Entities) {

    var ENTITIES = [];

    var service = {
      changeEntity,
      getChangedEntites,
      clearChangedEntities
    }

    return service;

    function changeEntity(entity) {
      if (ENTITIES.indexOf(entity) === -1) {
        ENTITIES.push(entity);
      }
    }

    function getChangedEntites() {
      return ENTITIES;
    }

    function clearChangedEntities() {
      ENTITIES = [];
    }

  }

}
