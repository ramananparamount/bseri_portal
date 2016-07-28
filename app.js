var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config/config'); // get our config file
var routes = require('./routes/index');
var users = require('./routes/users');
var training= require('./routes/training');
var junction = require('./routes/junction');

var app = express();


//*************************************************************
//To make the application redirected to the https if unsecured
//*************************************************************
// app.enable('trust proxy');
// app.use (function (req, res, next) {
//         if (req.secure) {
//                 // request was via https, so do no special handling
//                 next();
//         } else {
//                 // request was via http, so redirect to https
//                 res.redirect('https://' + req.headers.host + req.url);
//         }
// });
//*************************************************************


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('superSecret', config.secret);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
require('./util/passport')(passport);

// app.use('/', function(req, res, next){
//     console.log("Passport authentication starts");

//     passport.authenticate('jwt', function(err, user) {
//         console.log("user is " + user);
//         if (err) {
//             console.log("Error");
//             // throw err;
//             next();
//         } else if(user == null) {
//             console.log("USer is null");
//             next();
//         }
//         else if(!user){
//             console.log("User is not set");
//             next();
//         }
//         else {
//             console.log("No Error");
//             // if everything is good, save to request for use in other routes
//             req.isValidUser = true;
//             next();
//         }


//     })(req, res, next);

// });


app.use('/api/home', routes);
app.use('/api/training', training);
app.use('/api/junction', junction);  


//Code for HTML5 Mode in angular -- need to expand
// app.all('*', function (req,res){
//         console.log('All');
//         res.redirect("/");

// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
