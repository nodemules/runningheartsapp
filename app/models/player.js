var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//require user model
var User = require('./user');

// define the schema for our venue model
var playerSchema = mongoose.Schema({

    name         : String,
    user         : { type: Schema.Types.ObjectId, ref: 'User' },
    totalWins    : Number,
    seasonWins   : String,
    totalPoints  : Number,
    seasonPoints : Number,
    isTd         : Boolean,
    stats        : [{
    	venue    : String,
    	venueId  : String,
    	date     : String,
    	game1    : Number,
    	game2    : Number
     }]

});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Player', playerSchema);