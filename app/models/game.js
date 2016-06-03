var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

// import schemas
var Player    = require('./player'),
    Event     = require('./event');

// define the schema for our venue model
var gameSchema = mongoose.Schema({
  "event"       : { "type" : Schema.Types.ObjectId, "ref" : "Event", "required" : true },
  "number"      : Number,                                                  // do we need this or can we just use the index of the object in the array
  "completed"   : Boolean,
  "players"     : [ 
    {
      "player"  : { "type" : Schema.Types.ObjectId, "ref" : "Player" },       // when populating events for a player, only load the name of each player
      "score"   : Number,
      "rank"    : Number
    }
  ]
});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Game', gameSchema);
