{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).filter('venueListFilter', (Utils) => {
    return (venues, search) => {
      if (!venues || !venues.length || !search) {
        return venues;
      }
      return Utils.arrays(venues).findAll(search, ['name', 'day', 'td.name']);
    }

  })

}
