{
  /* global angular, APP_NAME, _ */

  angular.module(APP_NAME).factory('objectUtil', objectUtil);

  objectUtil.$inject = [];

  function objectUtil() {

    const OBJECT_OBJECT = '[object Object]';
    const OBJECT_TYPEOF = 'object';

    var service = {
      setProperty
    };

    return service;

    function isObject(obj) {
      var byCall = Object.prototype.toString.call(obj) === OBJECT_OBJECT;
      var byInstance = (obj instanceof Object);
      var byType = (typeof obj === OBJECT_TYPEOF);
      return byCall && byInstance && byType;
    }

    function setProperty(prop, value, obj) {
      if (!isObject(obj)) {
        obj = {};
      }

      return _.set(obj, prop, value)

    }
  }

}
