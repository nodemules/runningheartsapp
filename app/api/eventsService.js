{
  function exports() {
    var Event = require('../models/event');
    var service = {
      createEvent
    }

    function createEvent(event, cb) {
      Event.create(event, (err, e) => {
        if (err)
          return cb(err);
        return cb(null, e);
      })
    }

    return service;
  }

  module.exports = exports;
}
