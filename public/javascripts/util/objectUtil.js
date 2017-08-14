{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('objectUtil', objectUtil);

  objectUtil.$inject = [];

  function objectUtil() {

    var service = {
      setProperty
    };

    return service;

    function setProperty(obj, path, value) {
      var parts = path.split('.'),
        part;
      while (part = parts.shift()) {
        if (typeof obj[part] != 'object') {
          obj[part] = {};
        }
        if (parts.length === 0) {
          obj[part] = value;
        } else {
          obj = obj[part];
        }
      }
    }
  }

}
