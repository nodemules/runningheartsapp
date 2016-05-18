var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

// import schemas
var Player   = require('./player')

// define the schema for our user model
var userSchema = mongoose.Schema({
    "local"            : {
        "username"     : String,
        "password"     : String
    },
    "usertype"         : Number,
    "player"           : { "type" : Schema.Types.ObjectId, "ref" : "Player" }
});

userSchema.pre('save', function(next) {
    var user = this;

    // generate a salt
    bcrypt.genSalt(8, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.local.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.local.password = hash;
            next();
        });
    });
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
