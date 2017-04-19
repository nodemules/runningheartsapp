var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// define the schema for our venue model
var venueSchema = mongoose.Schema({
  'statusId': {
    'type': Number,
    'default': 1
  },
  'name': String,
  'day': String,
  'time': String,
  'numberOfGames': Number,
  'td': [{
    'type': Schema.Types.ObjectId,
    'ref': 'Player'
  }],
  'events': [{
    'type': Schema.Types.ObjectId,
    'ref': 'Event'
  }]
});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Venue', venueSchema);
