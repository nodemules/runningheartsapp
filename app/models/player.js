var mongoose = require('mongoose');

// define the schema for our venue model
var playerSchema = mongoose.Schema({

    playerName   : String,
    userId       : String,
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