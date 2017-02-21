{
  var mongoose = require('mongoose');

  // define the schema for our permission model
  var permissionSchema = mongoose.Schema({
    'key': {
      type: String,
      unique: true
    },
    'value': {
      type: Number,
      unique: true
    }
  }, {
    _id: false
  });

  // create the model for permissions and expose it to our app
  module.exports = mongoose.model('Permission', permissionSchema);
}
