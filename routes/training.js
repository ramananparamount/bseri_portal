var express = require('express');
var router = express.Router();
var passport = require('passport');
var EventsModel = require('../models/eventmodel');
var UserEventsModel = require('../models/usereventsmodel');
var CourseModel = require('../models/coursemodel');

const requireAuth = passport.authenticate('jwt', { session: false });

// router.use('/', function(req, res, next){
//     console.log("Passport authentication starts");

//     passport.authenticate('jwt', function(err, user) {
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
//             // res.clearCookie('jwt');
//             // console.log("setting Valid user");
//             // res.cookie('jwt', "JWT " + token);

//             // var token = req.cookies['jwt'];
//             // res.cookie('jwt', token);
//             req.isValidUser = true;
//             next();
//         }


//     })(req, res, next);

// });

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log("Entered Training home");
    EventsModel.find({'status':'active'})
            .select('eventid startdate isImportant isTutorAvl Trainer conductingOrg duration Price course')
            .sort({startdate:1})
            .populate({path:'course', select: 'keyword title briefdesc smallimage'})
            .exec(function(err, courses){
                    // console.log("executed the home");
                    if(err) {
                        console.log("Error2 : " + err);
                        throw err;
                    }
                    console.log("Courses : " + courses);
                    res.status(200).json({ 
                        courses: courses 
                    });

    });




  // res.json({user:req.isValidUser || null,
  //           courses: [
  //               {id:'msf',smallimage:'images/info.png', StartDate:'2016-07-16', isImportant:true, isTutorAvl: false, Trainer:'Govind Srinivasan', title: 'MSF', briefdesc:'lorem ipsum lorem ipsum',duration:'1 day', price:"Rs. 2500" },
  //               {id:'iso14001', smallimage:'images/bcm.png', StartDate:'2016-07-31', isImportant:false,  isTutorAvl: false, title: 'ISO 14001', briefdesc:'lorem ipsum lorem ipsum',duration:'4 days', price:"Rs. 25000" },
  //               {id:'iso20000',smallimage:'images/service.jpg', StartDate:'2016-08-12', isImportant:true,  isTutorAvl: false, Trainer:'Manjula', title: 'ISO 20000:2005', briefdesc:'lorem ipsum lorem ipsum',  duration:'1 day', price:"Rs. 25050" },
  //               {id:'iso18001', smallimage:'images/risk.jpg', StartDate:'2016-08-18', isImportant:false, isTutorAvl: false, title: 'ISO 31000', briefdesc:'Risk Management', duration:'5 days', price:"Rs. 25030" },
  //               {id:'msf', smallimage:'images/records.jpg', StartDate:'2016-07-16', isImportant:true, isTutorAvl: false, Trainer:'Govind Srinivasan', title: 'ISO 30301/ISO 15489', briefdesc:'Records Management',duration:'1 day', price:"Rs. 25030" },
  //               {id:'iso14001',smallimage:'images/qms.jpg', StartDate:'2016-07-31', isImportant:false,  isTutorAvl: false, title: 'ISO 9001:2008', briefdesc:'Quality Management System',duration:'4 days', price:"Rs. 25300" },
  //               {id:'iso27001', smallimage:'images/iso27001-small.jpg', StartDate:'2016-08-12', isImportant:true,  isTutorAvl: false, Trainer:'Manjula', title: 'ISO 27001 - A Course on Information Security Implementation', briefdesc:'Information is the foundation to transacting business in any organization.  Information Security is now a basic requirement of any organization.  To learn more on our course please visit our details page.',  duration:'4 days', price:"Rs. 25040" },
  //               {id:'iso18001',smallimage:'images/ems.png', StartDate:'2016-08-18', isImportant:false, isTutorAvl: false, title: 'ISO 14001:2004', briefdesc:'Environmental Management System', duration:'5 days', price:"Rs. 25060" }
  //           ]    
  // });
});



router.get('/eventIsRegistered/:eventid',requireAuth, function(req, res){
    console.log("User ID: " + req.user._id);
    console.log("getting details for the id:" + req.params.eventid);
    EventsModel.findOne({eventid:req.params.eventid},{_id:1},function (err, event){
        if(err) {
            console.log("Error2 : " + err);
            throw err;
        }
        if(!event) {
            console.log("No Event with the eventid: " + req.params.eventid);
            return res.json({ success: false, message: "No Event available with the eventid: " + req.params.eventid });
        }
        var eventrefid = event._id;
        UserEventsModel.findOne({userid:req.user._id, eventref:eventrefid}, function (err, event){
            if(err) {
                console.log("Error in getting the userevent for user & event : " + err);
                throw err;
            }
            console.log(event);
            if(event)
            {
                console.log("Event Already registered for the user");
                return res.status(200).json({ isregistered: true, message: 'Event Already registered for the user.'});
            }
            else
            {
                console.log("Event Not registered for the user");
                return res.status(200).json({ isregistered: false, message: 'Event Not registered for the user.'});
            }
        });
    });
    
});

router.get('/:keyword/:eventid', function(req, res, next) {
  console.log("getting details for the id:" + req.params.eventid + "," + req.params.keyword);

    EventsModel.findOne({'eventid':req.params.eventid})
        .select('eventid startdate enddate Trainer location phone email Price course')
        .populate({path:'course', select: 'keyword title midimage coursedesc1 coursedesc2 coursedesc3'})
        .exec(function(err, event){
            console.log("executed the details page");
            if(err) {
                console.log("Error2 : " + err);
                throw err;
            }
            console.log("Course : " + event);
            res.status(200).json({ 
                course: event 
            });

    });

  // res.json({user:req.isValidUser || null, title: "BSERI", title: "ISO 27001 - Information Security", midimage: '/images/iso27001-mid.jpg', 
  //           coursedesc1:"Organizations generate, disseminate and dispose of signficant volumes of information in not just transacting business but also in formulating the very strategy of the business.  Technological advances in the ways information is created, used and ultimately disposed of, makes information vulnerable to misuse.",
  //           coursedesc2:"Information security is now a basic requirement for all organizations that are serious about their sustainance.  ISO 27001:2013 is the international management systems standard for information security.  Organizations serious about information security can build an Information Security Management System based on their organizational needs to secure information.",
  //           coursedesc3:"BSERI's unique implementation course will teach participants the importance of requirements, what the basic components of an ISMS are and how to implement these in our 5 day highly interactive ISMS Lead Implementer course.  Participants who qualify in the examination will be issued with an IMASCAS accredited 'Lead Implementor' certificate.",
  //           starttime:"9:00 AM",  startdate: "Aug 12 2016", endtime:"5:00 PM", enddate:"Aug 15 2016", location:"Chennai", phone:"9829039202", email:"info@bseri.net", price:"Rs. 2500"
  // });
});


router.get('/myevents',requireAuth, function(req, res){
    console.log("User ID: " + req.user._id);


    UserEventsModel
        .findOne({userid:req.user._id, status:'Registered'})
        .select('userid eventref')
        .sort({startdate:1})
        .populate(
            {
                path:'eventref', 
                select: 'eventid startdate isImportant isTutorAvl Trainer conductingOrg duration Price course'
            })
        .exec(function(err, myevents){
            if(err) {
                console.log("Error in the myevents : " + err);
                throw err;
            }
            UserEventsModel
                .populate(myevents, 
                    {
                        path: 'eventref.course',
                        select: 'keyword title briefdesc smallimage',
                        model: 'courses'
                    },
                    function(err, mycourses){
                        if(err) {
                            console.log("Error in the myevents : " + err);
                            throw err;
                        }
                        console.log("course="+mycourses.eventref);                                                    
                        res.status(200).json({
                            courses:mycourses.eventref
                        });  
                    }
            );
        });
});

router.post('/registerCourse/:keyword/:eventid', requireAuth, function(req, res, next) {
    console.log("posting to event user map for the id:" + req.params.eventid + "," + req.params.keyword);
    console.log("User ID: " + req.user._id);

    //Check if user is there
    //If user exists, then 
    //    check if event is already set then 
    //          return - Already registered
    //    else  update the document with the event
    //If user not exists, then
    //  Insert new user with event

    //Get EventID
    EventsModel.findOne({eventid:req.params.eventid},{_id:1},function (err, event){
        if(err) {
            console.log("Error2 : " + err);
            throw err;
        }
        if(!event) {
            console.log("No Event with the eventid: " + req.params.eventid);
            return res.json({ success: false, message: "No Event available with the eventid: " + req.params.eventid });
        }
        var eventrefid = event._id;
        console.log("eventrefid:" + eventrefid);
        UserEventsModel.findOne({userid:req.user._id}, function (err, userevent){
            if(err) {
                console.log("Error in getting the userevent : " + err);
                throw err;
            }
            console.log(userevent);
            if(userevent)
            {
                UserEventsModel.findOne({userid:req.user._id, eventref:eventrefid}, function (err, event){
                    if(err) {
                        console.log("Error in getting the userevent for user & event : " + err);
                        throw err;
                    }
                    console.log(event);
                    if(event)
                    {
                        console.log("Event Already registered for the user");
                        return res.json({ success: false, message: 'Event Already registered for the user.'});
                    }
                    else
                    {
                        console.log("Event updating for Already registered user");
                        //Update the db doc with event
                        userevent.eventref.push(eventrefid);
                        userevent
                            .save()
                            .then(function(doc) {
                                console.log('Successfully Registered for the course');
                                return res.json({ success: true, message: 'Successfully Registered for the course.' });
                            })
                            .catch(function (err) {
                                console.log('Error occured while Registering for the user');
                                return res.json({ success: false, message: 'Error occured while Registering for the user.'});
                            });
                    }

                });
            }
            else
            {
                //Insert new record             
                console.log("Inserting new record");
                var newUserEvent = new UserEventsModel({
                    userid: req.user._id,
                    eventref: [eventrefid],
                    status: 'Registered'
                });
                console.log(newUserEvent);
                var promise = newUserEvent.save();
                promise.then(function(doc) {
                    console.log('Successfully Registered for the course');
                    return res.json({ success: true, message: 'Successfully Registered for the course.' });
                })
                .catch(function (err) {

                    console.log('Error occured while Registering for the user' + err);
                    return res.json({ success: false, message: 'Error occured while Registering for the user.'});
                });
            }
        });
    
    });
});

module.exports = router;
