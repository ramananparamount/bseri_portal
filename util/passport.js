var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/usermodel');
var config = require('../config/config'); // get db config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
//   opts.jwtFromRequest = function(req) {
//     var token = null;
//     if (req && req.cookies)
//     {
//         token = req.cookies['jwt'];
//         console.log(token);
//     }
//     return token;
// };

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("PayloadID - " + jwt_payload.id);
    User.findOne({_id: jwt_payload.id}, function(err, user) {
          if (err) {
              console.log(err);
              return done(err, false);
          }
          if (user) {
              console.log("the user is " + user.email);
              done(null, user);
          } else {
              console.log("error in passport-jwt");
              done(null, false);
          }
      });
  }));
};