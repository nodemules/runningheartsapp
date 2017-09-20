{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).filter('eventListFilter', ['Utils', (Utils) => {
    return (events, search) => {
      if (!events || !events.length || !search) {
        return events;
      }
      return Utils.arrays(events).findAll(search, ['venue.name', 'fullDate', 'td.name']);
    };

  }]);

}
