const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const massive = require('massive');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const config = require('./server_config.js');
var connectionstring = config.connectionString;

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
var massiveInstance = massive.connectSync({connectionString: connectionstring});

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  db.find_by_id([user.user_id],function(err,user){
    if(err){console.log('error in deserializeUser',err);}

    else{done(null,user)};
  });
});

app.set('db', massiveInstance);

app.use(express.static(__dirname + '/frontend'));
module.exports = app;
const request = require('./server/requests/requests.js');
var db = app.get('db');

passport.use(new LocalStrategy(
  // console.log('test');
  function(username,password,done){
    db.user_pass([username],function(err,user){
<<<<<<< HEAD
=======

      user = user[0];
>>>>>>> cf6f57c3fd540cb5627d9b54c68377eb7876a2ea
      if(err){
        //console.log('username not given');
        //console.log('error in LocalStrategy', err);
        return done(err);
      }
      if(!user){
        return done(null,false,{message:"Incorrect username"});
      }
      if(user.password !== password){
        // This is not secure, testing purposes only!!!!!!!!!
        return done(null,false,{message: 'Incorrect password'});
      }
      else{
          return done(null,user);
      }
    });
  }
))

function restrict(req, res, next) {
  if(req.isUnauthenticated()) return res.status(403).json({message:'please login'});
  next();
}


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
// get employee sites
app.get('/getUserInfo/:id',request.getUserInfo);

app.post('/auth/login', passport.authenticate('local'), function(req, res) {
console.log(req.user);
    res.status(200).json(req.user);

});

app.get('/auth/current', function(req, res) {
  // console.log('req.user',req.session);
  res.json(req.session);
})

// get User sites
app.get('/getUserSites/:id',request.getUserSites);
// create the first part of the site
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

