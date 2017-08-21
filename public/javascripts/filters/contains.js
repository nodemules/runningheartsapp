{
  /* global APP_NAME, angular */
  angular.module(APP_NAME).filter('contains', function(Utils) {
    return function(array, needle) {
      return Utils.arrays(array).find(needle).length > 0;
    };
  });
}
