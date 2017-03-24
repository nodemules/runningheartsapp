{
  function exports() {
    var Venue = require('../models/venue');
    var service = {
      getVenues
    }

    function getVenues(cb) {
      Venue
        .find({
          statusId: 1
        })
        .populate('td')
        .select('-statusId')
        .exec(function(err, venues) {
          if (err) {
            return cb(err);
          }
          cb(null, venues);
        });
    }

    return service;
  }

  module.exports = exports;
}
