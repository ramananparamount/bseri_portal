var express = require('express');
var passport = require('passport');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('../config/config'); // get our config file
var UserModel = require('../models/usermodel');
var HomeSliderModel = require('../models/homeslidermodel');
var CoursesModel = require('../models/coursemodel');
var EventsModel = require('../models/eventmodel');

// const requireAuth = passport.authenticate('jwt', { session: false });

var router = express.Router();

router.use('/', function(req, res, next){
    console.log("Passport authentication starts");

    passport.authenticate('jwt', function(err, user) {
        if (err) {
            console.log("Error");
            // throw err;
            next();
        } else if(user == null) {
            console.log("USer is null");
            next();
        }
        else if(!user){
            console.log("User is not set");
            next();
        }
        else {
            console.log("No Error");
            // if everything is good, save to request for use in other routes
            // res.clearCookie('jwt');
            // console.log("setting Valid user");
            // res.cookie('jwt', "JWT " + token);

            // var token = req.cookies['jwt'];
            // res.cookie('jwt', token);
            req.isValidUser = true;
            next();
        }


    })(req, res, next);

});

/* GET home page. */
router.get('/', function(req, res, next) {
    var contents = [];
    HomeSliderModel
            .find({'status':'active'})
            .sort({seq:1})
            .exec(function(err, items){
        if(err) {
            console.log("Error : " + err);
            throw err;
        }
        contents = items; 

        EventsModel.find({'status':'active'})
                    .select('eventid startdate isImportant conductingOrg duration Price course')
                    .sort({startdate:1})
                    .populate({path:'course', select: 'keyword title briefdesc smallimage'})
                    .limit(6)
                    .exec(function(err, courses){
                            // console.log("executed the home");
                            if(err) {
                                console.log("Error2 : " + err);
                                throw err;
                            }
                            // console.log("Courses : " + courses);
                            res.json({ 
                                contents: contents,
                                courses: courses,
                                testimonials: {} 
                        });

        });

    });


  // res.json({user:req.isValidUser || null, title: 'BSERI', 
  //       contents: [
  //         {media:"video",video:'/images/cook.mp4',image: '/images/main1.jpg' , type:"video/mp4", title: "BSERI Banner 2", detailslink: "yahoo.com"},
  //         {media:"image",image: '/images/main1.jpg', title: "BSERI Banner 1", detailslink: "google.com"},
  //         {media:"image",image: '/images/main2.jpg', title: "BSERI Banner 3", detailslink: "yahoo.com"},
  //         {media:"image",image: '/images/main3.jpg', title: "BSERI Banner 4", detailslink: "gmail.com"}],
  //       courses: [
  //         {smallimage:'/images/event1.jpg', StartDate:'2016-07-16', isImportant:true, host:"Paramount", title: "MSF", briefdesc: "1At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",id:"msf",duration:'4 days', price:"Rs. 25300" },
  //         {smallimage:'/images/event2.jpg', StartDate:'2016-07-31', isImportant:true, host:"Paramount", title: "ISO 14001", briefdesc: "2At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.iso14001",id:"iso14001",duration:'1 days', price:"Rs. 5300" },
  //         {smallimage:'/images/iso27001-small.jpg', StartDate:'2016-08-12', isImportant:true, host:"Paramount", title: "ISO 27001 - A course on Information Security Implementation", briefdesc: "Information is the foundation to transacting business in any organization.  Information Security is now a basic requirement of any organization.  To learn more on our course please visit our details page.",id:"iso27001",duration:'1 days', price:"Rs. 42500" },
  //         {smallimage:'/images/event1.jpg', StartDate:'2016-08-18', isImportant:true, host:"Paramount", title: "ISO 18001", briefdesc: "4At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.iso18001",id:"iso18001",duration:'2 days', price:"Rs. 2500" }
  //       ],
  //       testimonials: {} });

});

// router.get('/login', function (req, res){
//   // var isValidUser = ValidateRequest(req, res);
//   res.json({user:req.isValidUser || null,showlogin:true, title: 'BSERI', 
//         contents: [
//           {media:"video",image: 'images/cook.mp4', type:"video/mp4", title: "BSERI Banner 2", detailslink: "yahoo.com"},
//           {media:"image",image: 'images/main1.jpg', title: "BSERI Banner 1", detailslink: "google.com"},
//           {media:"image",image: 'images/main2.jpg', title: "BSERI Banner 3", detailslink: "yahoo.com"},
//           {media:"image",image: 'images/main3.jpg', title: "BSERI Banner 4", detailslink: "gmail.com"}],
//         courses: [
//           {smallimage:'images/event1.jpg', StartDate:'2016-07-16', importance:"high", host:"Paramount", title: "MSF", briefdesc: "1At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",detailslink:"msf",duration:'4 days', price:"Rs. 25300" },
//           {smallimage:'images/event2.jpg', StartDate:'2016-07-31', importance:"high", host:"Paramount", title: "ISO 14001", briefdesc: "2At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.iso14001",detailslink:"iso14001",duration:'1 days', price:"Rs. 5300" },
//           {smallimage:'images/event3.jpg', StartDate:'2016-08-12', importance:"high", host:"Paramount", title: "ISO 27001", briefdesc: "3At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.iso27001",detailslink:"iso27001",duration:'1 days', price:"Rs. 42500" },
//           {smallimage:'images/event1.jpg', StartDate:'2016-08-18', importance:"high", host:"Paramount", title: "ISO 18001", briefdesc: "4At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.iso18001",detailslink:"iso18001",duration:'2 days', price:"Rs. 2500" }
//         ],
//         testimonials: {} });
// });

router.post('/login', function (req, res){
  console.log("Test: " + req.body.username);
  // find the user
  UserModel.findOne({email: req.body.username}, function(err, user) {
     if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            var payload = {id:user._id,email:user.email,name:user.name,role:(user.admin === true)?'admin':'user'};
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(payload, config.secret, {
                      expiresIn: '24h' // in seconds
                  });
            console.log(user);
            console.log(token);
            res.json({ success: true, token: 'JWT ' + token});
            // res.cookie('jwt', token);
            // res.status(200);
            // res.redirect('/');
          }
          else {
            console.log("Wrong Password");
            // res.redirect("/login");
            res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }

  });

});

router.post('/register', function(req,res,next){
    if(!req.body.email || !req.body.password) {
        res.json({ success: false, message: 'Please enter email and password.' });
    } else {
        // find the user
        UserModel.findOne({email: req.body.email}, function(err, user) {
            if (err) {
                console.log("error");
                throw err;
            }

            if (!user) {
                var newUser = new UserModel({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.username,
                    mobile: req.body.phone || "",
                    admin: req.body.admin || false
                });

                // Attempt to save the user
                newUser.save()
                  .then(function(user){
                    console.log('Successfully created new user.');
                    res.json({ success: true, message: 'Successfully created new user.' });
                  })
                  .catch(function(err){
                    console.log('That email address already exists. :' + err);
                    res.json({ success: false, message: 'That email address already exists.'});
                  });
            } else if (user) {
                console.log('That email address already exists.');
                return res.json({ success: false, message: 'That email address already exists.'});
            }
        });//UserModel.findone
    }
});


router.post('/logout', function(req, res){
  console.log("LOGGING OUT ");
  res.end();
});


// //logs user out of site, deleting them from the session, and returns to homepage
// router.get('/logout', function(req, res){
//   ReleaseToken(req, res);

//   // var name = req.user.username;
//   console.log("LOGGIN OUT ")
//   // req.logout();
//   res.redirect('/');
//   // req.session.notice = "You have successfully been logged out " + name + "!";
// });



// var get_cookies = function(request) {
//   var cookies = {};
//   if(request.headers.cookie === undefined) {
//     return null;
//   }
//   request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
//     var parts = cookie.match(/(.*?)=(.*)$/)
//     cookies[ parts[1].trim() ] = (parts[2] || '').trim();
//   });
//   return cookies;
// };

// function getToken(req){
//   var _cookieList = get_cookies(req)
//   if(_cookieList == null ) {
//     console.log("No cookies");
//     return null;
//   }
//   var _cookie = _cookieList['jwt'];
//   console.log("This is a cookie:" + _cookie);


//   var token = req.body.token || req.query.token || req.headers['jwt'] || _cookie;

//   return token;
// }


// route middleware to verify a token
function IsLoggedIn(req, res, next) {

  var _cookie = req.cookies.jwt;
  console.log(_cookie);

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['jwt'] || _cookie;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}

// //For every Request, this function validates the token and proceeds with the processing if the user is valid
// function ValidateRequest(req, res){
//   var token = getToken(req);
//   if(token != null){
//     console.log("token is " + token);
//     res.clearCookie('jwt');
//   }

//   if(token == null) {
//       console.log("token is null");
//   }

//   if(token != null)
//   {
//     console.log("setting Valid user");
//     // res.cookie('jwt', "JWT " + token);
//     res.cookie('jwt', token);
//     return true; 
//   }
//   return null;

// }

// function ReleaseToken(req, res){
//   var token = getToken(req);
//   if(token != null){
//     console.log("token is " + token);
//     res.clearCookie('jwt');
//   }
//   return null;
// }


module.exports = router;
