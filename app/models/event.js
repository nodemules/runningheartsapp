var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// define the schema for our event model
var eventSchema = mongoose.Schema({
  'statusId': {
    'type': Number,
    'default': 1
  },
  'date': {
    'type': Date,
    'default': Date.now
  },
  'venue': {
    'type': Schema.Types.ObjectId,
    'ref': 'Venue'
  },
  'td': {
    'type': Schema.Types.ObjectId,
    'ref': 'Player'
  },
  'games': [{
    'type': Schema.Types.ObjectId,
    'ref': 'Game'
  }]
});

// create the model for venues and expose it to our app
module.exports = mongoose.model('Event', eventSchema);
