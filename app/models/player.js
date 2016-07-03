var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// import schemas
var User    = require('./user'),
    Event   = require('./event');

// define the schema for our venue model
var playerSchema = mongoose.Schema({
  "statusId"  : { "type" : Number, "default" : 1 },
  "name"         : { "type" : String, "required" : true },
  "user"         : { "type" : Schema.Types.ObjectId, "ref" : "User" },
  "isTd"         : Boolean,
  "stats"        : {                                                        // let's figure out how we populate this from the event data
    "totalWins"    : Number,
    "seasonWins"   : Number,
    "totalPoints"  : Number,
    "seasonPoints" : Number
  }
});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Player', playerSchema);