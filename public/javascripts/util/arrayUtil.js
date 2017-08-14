{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('arrayUtil', arrayUtil);

  arrayUtil.$inject = ['$filter'];

  function arrayUtil($filter) {

    const _ID = '_id';

    var service = {
      findAll
    };

    function findAll(arr, value, props) {
      if (!arr) {
        console.error('Cannot filter on undefined. Provide an array as the first argument.')
        return;
      }
      var filtered = angular.copy(arr);
      if (props && !Array.isArray(props)) {
        var value = angular.copy(props);
        props = [];
        props.push(value);
      }
      if (!props || !Array.isArray(props)) {
        console.error('No valid properties to filter on, returning original array value.');
        return filtered;
      }
      var filters = [];
      angular.forEach(props, (prop) => {
        var filter = {};
        filter[prop] = value;
        filters.push($filter('filter')(arr, filter));
      })
      return uniqById(join(filters));
    }

    function join(arraysToJoin) {
      var arr = [];
      angular.forEach(arraysToJoin, (joinArr) => {
        arr = arr.concat(joinArr);
      });
      return arr;
    }

    function uniqById(arr) {
      return uniq(arr, _ID);
    }

    function uniq(arr, prop) {
      if (!arr || !Array.isArray(arr)) {
        console.error('This method requires an array as the first argument.')
        return;
      }
      if (!prop) {
        console.error('Cannot reduce an undefined property. Provide a property to match on as the second argument.',
          'Returning original array value');
        return arr;
      }
      return arr.filter((obj, pos, inner) => {
        return inner.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      })

    }

    return service;

  }

}
