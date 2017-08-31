{

  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var arrayUtil = require('./arrayUtil')();

    const MESSAGE_REQUIRE_ARRAY = 'This method requires an Array as the first argument.';

    var service = {
      arrays
    };

    return service;

    function arrays(arr) {
      if (!arr || !Array.isArray(arr)) {
        LOG.error(MESSAGE_REQUIRE_ARRAY);
        return {};
      }
      return {
        find: (predicate) => arrayUtil.find(arr, predicate),
        findById: (id) => arrayUtil.findById(arr, id)
      };
    }

  }

  module.exports = exports;
}
