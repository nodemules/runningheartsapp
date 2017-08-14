{
  angular.module(APP_NAME).factory('Utils', utils);

  utils.$inject = ['arrayUtil', 'objectUtil'];

  function utils(arrayUtil, objectUtil) {
    var service = {
      arrays,
      objects
    };

    return service;

    function arrays(arr) {
      return {
        findAll: (value, props) => arrayUtil.findAll(arr, value, props)
      }
    }

    function objects(obj) {
      return {
        setProperty: (path, value) => objectUtil.setProperty(obj, path, value)
      }
    }

  }
}
