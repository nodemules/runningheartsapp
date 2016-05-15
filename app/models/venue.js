var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

// import schemas
var Player    = require('./player'),
    Event     = require('./event');

// define the schema for our venue model
var venueSchema = mongoose.Schema({
  name      : String,
  time      : Date,
  td        : { type: Schema.Types.ObjectId, ref: 'Player' },
  events    : [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Venue', venueSchema);
