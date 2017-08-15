{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('stringUtil', stringUtil);

  stringUtil.$inject = [];

  function stringUtil() {

    const OBJECT_STRING = '[object String]';
    const STRING_TYPEOF = 'string';

    var service = {
      isString
    };

    return service;

    function isString(str) {
      var byCall = Object.prototype.toString.call(str) === OBJECT_STRING;
      var byInstance = (str instanceof String);
      var byType = (typeof str === STRING_TYPEOF);
      return byCall;
    }

  }

}
