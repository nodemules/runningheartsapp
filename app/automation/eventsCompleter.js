{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var Event = require('../models/event');

    var service = {
      markEventsCompleted
    };

    function markEventsCompleted(events) {
      events.forEach((event) => {
        event.completed = true;
        Event
          .findOneAndUpdate({
            _id: event._id
          }, event, {
            'new': true
          })
          .select('-statusId')
          .exec((err, e) => {
            if (err) {
              return LOG.error(err);
            }
            LOG.info(`Event ${e._id} Marked Completed`);
          });
      });
    }

    return service;
  }

  module.exports = exports;
}
