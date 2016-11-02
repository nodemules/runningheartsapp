var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// define the schema for our event model
var seasonSchema = mongoose.Schema({
  "seasonNumber": {
    "type": Number,
    "unique": true
  },
  "startDate": {
    "type": Date,
    "default": Date.now
  }
});

// create the model for venues and expose it to our app
module.exports = mongoose.model('Season', seasonSchema);
