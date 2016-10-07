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
              res.send('site added');
            }
        });
    },
    scehduledata: function(req, res, next) {
          var r = req.body;
          var day = r.shift.name;
          db.create_contract_days(day, function(err, days) {
                  if (err) {
                      res.send(err);
                  } else {
                      db.create_hours(hours, function(err, hour) {
                          if (err) {
                              res.send(err);
                          } else {
                              res.send('hours and days added');
                          }
                      });
                  }
              });
          },
    // Add a new employee
    createemployee: function(req, res, next) {
        var r = req.body;
        var employeeArray = [r.first_name, r.last_name, r.full_part_time, r.leo_sfo, r.admin, r.county];
        // console.log(employeeArray);
        db.create_employee(employeeArray, function(err, employee) {
            if (err) {
                res.send(err);
            } else {
                res.send('employee added');
            }
        });
    }


}; //end of module
