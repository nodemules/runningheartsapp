{

  function exports() {

    var arrayUtil = require('./arrayUtil')();

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
        console.error(MESSAGE_REQUIRE_ARRAY);
        return {};
      }
      return {
        find: (predicate) => arrayUtil.find(arr, predicate),
        findById: (id) => arrayUtil.findById(arr, id)
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

  module.exports = exports;
}
