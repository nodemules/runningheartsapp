{
  function exports() {
    var eventsService = require('../api/eventsService')(),
      dateUtil = require('../util/dateUtil')();
    var Event = require('../models/event');

    var service = {
      markEventsCompleted
    }

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
            if (err)
              console.log(err);
            console.log(`Event ${event._id} Marked Completed`);
          })
      })
    }

    return service;
  }

  module.exports = exports;
}
