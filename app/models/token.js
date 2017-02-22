{
  var mongoose = require('mongoose');

  // define the schema for our token model
  var tokenSchema = mongoose.Schema({
    'tokenId': {
      type: String,
      unique: true
    }
  }, {
    timestamps: true
  });

  // create the model for tokens and expose it to our app
  module.exports = mongoose.model('Token', tokenSchema);
}
