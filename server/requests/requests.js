var app = require('../../index');

var db = app.get('db');

module.exports = {
    // View Exsisting Sites
    getsite: function(req, res, next) {
        db.show_site(function(err, site) {
            if (!err) {
                res.status(200).json(site);
            } else {
                console.log("This isn't working.");
            }


        });
    },
    // Add a new site

    createsite: function(req, res, next) {
        var r = req.body;
        var siteArray = [r.name, r.address_street, r.address_city, r.address_state, r.site_info, r.contract_begin, r.contract_end];
        db.create_site(siteArray, function(err, site) {
            if (err) {
                res.send(err);
            } else {
                res.send(site);
            }
        });
    },
    createdayandhours: function(req, res, next) {
        var r = req.body;
                db.create_contract_days([r.site_id], function(err, day) {
                    if (err) {
                      console.log('this isnt working');
                        res.send(err);
                    } else {
                      // console.log(r.contract_day);
                      var shifthours = [r.contract_day,r.firstshift_begin, r.firstshift_end, r.secondshift_begin, r.secondshift_end, r.thirdshift_begin, r.thirdshift_end, r.fourthshift_begin, r.fourthshift_end, r.site_id_fk];
                        db.create_hours(shifthours, function(err, hour) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('this should be working');
                            }
                        });
                      }
                    });
              },
    // Add a new employee
    createemployee: function(req, res, next) {
        var r = req.body;
        var employeeArray = [r.first_name, r.last_name, r.admin,r.email, r.password];
        db.create_employee(employeeArray, function(err, employee) {
            if (err) {
                res.send(err,'an employee was not created');
            } else {
                res.send(employee);
                console.log(employee);
            }
        });
    },
// Shows a schedule overview
  scheduleoverview: function(req,res,next){
    db.schedule_overview(function(err,overview){
      if(err){
        res.send(err,'overview not viewed');
      } else{
        res.send(overview);
      }
    });
  },

  // shows contract days

  scheduleDays: function(req,res,next){
    db.schedule_days([req.params.id],function(err,days){
      if(err){
        res.send(err,'hours not viewed');
      } else {
        res.send(days);
      }
    })
  },

  // shows contract hours

  scheduleHours: function(req,res,next){
    db.schedule_hours([req.params.id],function(err,hours){
      if(err){
        res.send(err,'days not viewed');
      } else{
        res.send(hours);
      }
    })
  }


}; //end of module
