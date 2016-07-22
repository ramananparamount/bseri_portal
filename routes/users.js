var express = require('express');
var passport = require('passport');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

var config = require('../config/config'); // get our config file
var UserModel = require('../models/usermodel');
var SALT_WORK_FACTOR = 10;

const requireAuth = passport.authenticate('jwt', { session: false });

var router = express.Router();


router.get('/register', function(req, res) {
    res.json('register', { });
});

router.post('/register', function(req, res) {
	if(!req.body.user || !req.body.password) {
		res.json({ success: false, message: 'Please enter email and password.' });
	} else {
		var newUser = new UserModel({
			email: req.body.user,
			password: req.body.password,
			name: req.body.user,
			mobile: "",
			admin: false
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

router.post('/authenticate', function(req, res) {

  // find the user
	UserModel.findOne({email: req.body.user}, function(err, user) {

	    if (err) throw err;

	    if (!user) {
		    res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	    	// check if password matches
	     	user.comparePassword(req.body.password, function(err, isMatch) {
				if (isMatch && !err) {
					// Create token if the password matched and no error was thrown
					var token = jwt.sign(user, config.secret, {
										expiresIn: '24h' // in seconds
								});
					res.json({ success: true, token: 'JWT ' + token });
				}
				else {
					res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
				}
			});
		}

	});
});

router.get('/', function (req, res) {
    // res.json({ user : req.user });
  UserModel.find({}, function(err, users) {
    res.json(users);
  });

});


router.get('/login', function(req, res) {
    res.json({ user : req.user });
});

// router.post('/login', function(req, res) {
//     res.json({});
// });

router.get('/logout', function(req, res) {
    req.logout();
    res.json({});
});


router.post('/hashPassword',requireAuth, function(req,res){
	UserModel.findOne({email: req.body.user}, function(err, user) {

	    if (err) throw err;

	    if (!user) {
		    res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	    	// UserModel.findOne({email:req.body.user},{password:1}, function(err, user){
		    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		        if (err) throw(err);

		        var password = user.password; 
		        // if(password === ""){
		        // 	password = "Sairam01*";
		        // 	console.log("empty password");	
		        // } 
		        // hash the password along with our new salt
		        bcrypt.hash(password, salt, function(err, hash) {
		            if (err) return next(err);

		            // override the cleartext password with the hashed one
					UserModel.update({email: req.body.user}, {password:hash},function(err){
						if (err) throw err;
						res.json({ success: true, message:'Password Successfully changed!'});

					});
		        });
		    });

		}
	});
});

router.post('/changePwd', requireAuth, function(req, res){
	// var	newpassword = req.body.newpassword;
	UserModel.findOne({email: req.body.user}, function(err, user) {

	    if (err) throw err;

	    if (!user) {
		    res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	    	// check if password matches
	     	user.comparePassword(req.body.password, function(err, isMatch) {
	     		if(err) throw err;
				if (isMatch && !err && req.body.newpassword) {
				// if (!err && req.body.newpassword) {
					user.password=req.body.newpassword;
					user.save(function(err){
				      if (err) {
				        return res.json({ success: false, message: 'There was an error changing the password.'});
				      }
				      res.json({ success: true, message: 'Password Successfully changed.' });

					});
					// UserModel.update({email: req.body.user}, {$set:{password:req.body.newpassword}},{multi:false},function(err){
					// 	if (err) throw err;
					// 	res.json({ success: true, message:'Password Successfully changed!'});

					// });
					
				}
				else {
					res.json({ success: false, message: 'Authentication failed. Existing Password did not match.' });
				}
			});
		}

	});



});


router.get('/getAllUsers',requireAuth, function(req, res){
	UserModel.find({}, function(err, users) {
	    res.json(users);
	  });	
});

// // route middleware to verify a token
// function IsLoggedIn(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, config.secret, function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// }


module.exports = router;
