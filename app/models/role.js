{
  var mongoose = require('mongoose'),
    Permission = require('./permission');

  // define the schema for our role model
  var roleSchema = mongoose.Schema({
    'name': String,
    'roleId': {
      type: Number,
      unique: true
    },
    'permissions': [Permission.schema]
  });

  // create the model for roles and expose it to our app
  module.exports = mongoose.model('Role', roleSchema);
}
