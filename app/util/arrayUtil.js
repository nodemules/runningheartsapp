{
  function exports() {

    var _ = require('lodash');

    const _ID = '_id';

    var service = {
      merge,
      mergeById,
      unionById
    }

    function merge(arr1, arr2, id) {
      return _.values(_.merge(
        _.keyBy(arr2, id),
        _.keyBy(arr1, id)
      ));
    }

    function mergeById(arr1, arr2) {
      return merge(arr1, arr2, _ID);
    }

    function unionBy(arr1, arr2, id) {
      return _.unionBy(arr1, arr2, (a) => {
        var o = {};
        o[id] = a[id];
        return _.find(arr2, o);
      });
    }

    function unionById(arr1, arr2) {
      return unionBy(arr1, arr2, _ID)
    }

    return service;

  }

  module.exports = exports;

}
