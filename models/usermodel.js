var db = require('../util/db')
var bcrypt = require('bcryptjs');

var SALT_WORK_FACTOR = 10;

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var mongoose = db.mongoose;
var Schema = db.schema;


// create a schema
var userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  admin: Boolean,
  status:{ type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) 
    {
	     console.log("returning w/o change to password");
    	 return next();
    }
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.statics.findByUsername = function (username, cb) {
  this.findOne({ username: username }, cb);
}

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
module.exports = mongoose.model('users', userSchema);
