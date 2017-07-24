/* global angular, APP_NAME, moment */
{

  angular.module(APP_NAME).factory('entityService', entityService);

  entityService.$inject = ['Entities'];

  function entityService(Entities) {

    var ENTITIES = [];
    var ENTITY_TIMEOUTS = {};
    const ENTITY_MAX_TIMEOUT = 300;

    var service = {
      changeEntity,
      getChangedEntites,
      getStaleEntities,
      clearEntities,
      clearChangedEntities,
      startEntityTimers
    }

    return service;

    function changeEntity(entity) {
      if (ENTITIES.indexOf(entity) === -1) {
        ENTITIES.push(entity);
        setEntityTimer(entity);
      }
    }

    function getChangedEntites() {
      var staleEntities = getStaleEntities();
      var entities = [...new Set(ENTITIES.concat(...staleEntities))];
      return entities;
    }

    function getAllEntities() {
      var entities = [];
      angular.forEach(Entities, (entity) => {
        if (typeof entity !== 'function') {
          entities.push(entity);
        }
      });
      return entities;
    }

    function getStaleEntities() {
      var entities = [];
      angular.forEach(ENTITY_TIMEOUTS, (lastSeen, entity) => {
        var entityId = Entities.fromId(entity);
        var now = moment();
        if (now.isAfter(lastSeen)) {
          entities.push(entityId);
          setEntityTimer(entity);
        }
      });
      return entities;
    }

    function clearEntities(entities) {
      startEntityTimers(entities);
      ENTITIES = [];
    }

    function clearChangedEntities() {
      startEntityTimers(ENTITIES);
      ENTITIES = [];
    }

    function startEntityTimers(entities) {
      if (!entities || !entities.length) {
        entities = getAllEntities();
      }
      angular.forEach(entities, (entity) => {
        setEntityTimer(entity);
      })
    }

    function setEntityTimer(entity) {
      var now = moment().add(ENTITY_MAX_TIMEOUT, 's').format();
      ENTITY_TIMEOUTS[entity] = now;
    }

  }

}
