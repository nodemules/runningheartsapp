{
  function exports() {
    var venuesService = require('../api/venuesService')(),
      eventsCreator = require('./eventsCreator')();

    var service = {
      createNewEvents
    }

    function createNewEvents() {
      venuesService.getVenues(function(error, venues) {
        eventsCreator.generateNewEvents(venues, () => {});
      })
    }

    return service;
  }
  module.exports = exports;
}
