var mongoose = require('mongoose');
var db = require('../config/config.js');

//Should not use async when calling from webpage
mongoose.connect(db.dbconnectstr);

// mongoose.createConnection(db.dbconnectstr, function (error) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//     	console.log("connected");	
//     }
// });

mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

var db = function () {
	return {
		mongoose: mongoose,
		connection: mongoose.connection,
		schema: mongoose.Schema
	};
};


module.exports = db();

