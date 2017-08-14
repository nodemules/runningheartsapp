{
  /* global angular, APP_NAME */

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

    function setProperty(path, value, obj) {
      if (!isObject(obj)) {
        obj = {};
      }
      var parts = path.split('.'),
        part;
      while (part = parts.shift()) {
        if (!isObject(obj[part])) {
          obj[part] = {};
        }
        if (parts.length === 0) {
          obj[part] = value;
        } else {
          obj = obj[part];
        }
      }
      return obj;
    }
  }

}
