{
  function exports() {
    var Event = require('../models/event');
    var service = {
      createEvent,
      createEvents
    }

    function createEvent(event, cb) {
      Event.create(event, (err, e) => {
        if (err)
          return cb(err);
        return cb(null, e);
      })
    }

    function createEvents(events, cb) {
      Event.insertMany(events, (err, e) => {
        if (err)
          return cb(err);
        return cb(null, e);
      })
    }

    return service;
  }

  module.exports = exports;
}
