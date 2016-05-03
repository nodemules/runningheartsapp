var mongoose = require('mongoose');

// define the schema for our venue model
var venueSchema = mongoose.Schema({

    name      : String,
    day       : String,
    time      : String,
    td        : String,
    tdId      : Number

});


// create the model for venues and expose it to our app
module.exports = mongoose.model('Venue', venueSchema);
