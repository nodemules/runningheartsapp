{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).filter('venueListFilter', ($filter, arrayUtil) => {
    return (venues, search) => {
      if (!venues || !venues.length) {
        return venues;
      }
      return arrayUtil.findAll(venues, search, ['name', 'day', 'td']);
    }

  })

}
