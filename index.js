const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const massive = require('massive');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const config = require('./server/config/config.json');
var connectionstring = config.connectionString;

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
var massiveInstance = massive.connectSync({connectionString: connectionstring});

app.set('db', massiveInstance);

app.use(express.static(__dirname + '/frontend'));
module.exports = app;
const request = require('./server/requests/requests.js');
var db = app.get('db');

passport.use(new LocalStrategy(
  function(username,password,done){
    db.user_pass({email:username},function(err,user){
      if(err){
        console.log('username not given');
        res.send(err);
      }
      if(!user){
        return done(null,false,{message:"Incorrect username"});
      }
      if(user.password !== user.password){
        // This is not secure, testing purposes only!!!!!!!!!
        return done(null,false,{message: 'Incorrect password'});
      }
      else{
          return done(null,user);
      }
    });
  }
))


//Beginning of EndPoints
// View sites
app.get('/site', request.getSite);
// View the schedule overview
app.get('/siteoverview',request.siteOverview);
// View the full site
app.get('/showSite',request.showSite)
// View employee
app.get('/viewemployee',request.viewEmployee);
//  view the sites days
app.get('/scheduledays/:id', request.scheduleDays);
// view site and hours
app.get('/getsiteandhours/:id',request.getSiteandHours);
// view the sites hours
app.get('/schedulehours/:id', request.scheduleHours);
// create the first part of the site
app.post('/login',
  passport.authenticate('local', { successRedirect: '/mainpage',
                                   failureRedirect: '/'
                                    })
);




app.post('/createsite', request.createSite);
// create the second part of the site
app.post('/createdayandhours',request.createDayandHours);
// create employees
app.post('/createemployee', request.createEmployee);
// create employee schedule
app.post('/employeeschedule', request.employeeSchedule);
// post user name




// updates the complete site
app.put('/updatesite/:id',request.updateSite);
// update the hours
app.put('/updatehours/:id',request.updateHours);
// update the employee
app.put('/updateemployee/:id', request.updateEmployee);











app.listen(config.port, function() {
    console.log('listening on port', config.port);
})
