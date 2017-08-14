{
  angular.module(APP_NAME).factory('Utils', utils);

  utils.$inject = ['arrayUtil', 'objectUtil'];

  function utils(arrayUtil, objectUtil) {

    const MESSAGE_REQUIRE_ARRAY = 'This method requires an Array as the first argument.';
    const MESSAGE_REQUIRE_OBJECT = 'This method requires an Object as the first argument.';

    var service = {
      arrays,
      objects,
      strings
    };

    return service;

    function arrays(arr) {
      if (!arr || !Array.isArray(arr)) {
        console.error(MESSAGE_REQUIRE_ARRAY)
        return {};
      }
      return {
        findOne: (value) => arrayUtil.findOne(arr, value),
        findAll: (value, props, exact) => arrayUtil.findAll(arr, value, props, exact)
      }
    }

    function objects(obj) {
      return {
        setProperty: (path, value) => objectUtil.setProperty(path, value, obj)
      }
    }

    function strings(str) {
      return {
        isString: () => stringUtil.isString(str)
      }
    }

  }
}
