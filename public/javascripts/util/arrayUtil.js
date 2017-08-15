{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('arrayUtil', arrayUtil);

  arrayUtil.$inject = ['$filter', 'objectUtil', 'stringUtil'];

  function arrayUtil($filter, objectUtil, stringUtil) {

    const MESSAGE_REQUIRE_ARRAY = 'This method requires an array as the first argument.';

    const _ID = '_id';

    var service = {
      find,
      findOne,
      findAll,
      join,
      uniqById,
      uniq
    };

    function find(arr, filter, exact) {
      if (!arr || !Array.isArray(arr)) {
        console.error(MESSAGE_REQUIRE_ARRAY)
        return;
      }
      return $filter('filter')(arr, filter, exact);
    }

    /**
     * Finds a single element in the array
     *
     * @param arr - the array to search
     * @param filter - the predicate to filter by, must match the type of element in the array
     *
     * @return exact matched value in array or undefined
     */
    function findOne(arr, filter) {
      var filtered = find(arr, filter, true);
      var one;
      switch (filtered.length) {
        case 0:
          break;
        case 1:
          one = angular.copy(filtered[0]);
          break;
        default:
          console.error('More than one record found in array for', filter,
            'Please provide a unique filter for this array.');
          break;
      }
      return one;
    }

    /**
     * Finds all the matching elements in an array
     *
     * @param arr - the array to search
     * @param value - the value to filter by
     * @param props - the properties to build the filter predicate with
     * @param exact - whether or not to use exact matching
     *
     * @description if the props parameter[3] is omitted, the default matching is done
     *    on the given array with the literal value
     *
     * @return matched values in array or undefined
     */
    function findAll(arr, value, props, exact) {
      if (!arr || !Array.isArray(arr)) {
        console.error(MESSAGE_REQUIRE_ARRAY)
        return;
      }

      if (props && !Array.isArray(props)) {
        var p = angular.copy(props);
        props = [];
        props.push(p);
      }

      if (!props || !Array.isArray(props)) {
        console.error('No valid properties to filter on, returning original array value.');
        return arr;
      }

      var filters = [];
      angular.forEach(props, (prop) => {
        filters.push(find(arr, objectUtil.setProperty(prop, value), exact));
      });

      return uniqById(join(filters));
    }

    /**
     * Concatenates a list of arrays
     *
     * @param arraysToJoin - the list of arrays to join
     *
     * @return all the elements of the given arrays as a single array
     */
    function join(arraysToJoin) {
      var arr = [];
      if (!arraysToJoin || !Array.isArray(arraysToJoin)) {
        console.error(MESSAGE_REQUIRE_ARRAY)
        return;
      }
      angular.forEach(arraysToJoin, (joinArr) => {
        if (Array.isArray(joinArr)) {
          arr = arr.concat(joinArr);
        }
      });
      return arr;
    }

    /**
     * Removes duplicates from an array by the given property
     *
     */
    function uniq(arr, prop) {
      if (!arr || !Array.isArray(arr)) {
        console.error(MESSAGE_REQUIRE_ARRAY)
        return;
      }
      if (!prop) {
        console.error('Cannot reduce an undefined property. Provide a property to match on as the second argument.',
          'Returning original array value.');
        return arr;
      }
      if (!stringUtil.isString(prop)) {
        console.error('Cannot reduce a non-String property. Provide a String to match on as the second argument.',
          'Returning original array value.');
        return arr;
      }
      return arr.filter((obj, pos, inner) => {
        return inner.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      })

    }

    /**
     * Removes duplicates from an array by the mongo ObjectID tag '_id'
     *
     * @param arr - the array to dedup
     *
     * @return unique elements of the given array
     */
    function uniqById(arr) {
      return uniq(arr, _ID);
    }

    return service;

  }

}
