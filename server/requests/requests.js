var app = require('../../index');

var db = app.get('db');

module.exports = {
    // View Exsisting Sites
    getSite: function(req, res, next) {
        db.show_site(function(err, site) {
            if (!err) {
                res.status(200).json(site);
            } else {
                console.log("This isn't working.");
            }


        });
    },
    // Add a new site

    createSite: function(req, res, next) {
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
    createDayandHours: function(req, res, next) {
        var r = req.body;
    var shifthours = [r.contract_day,r.firstshift_begin, r.firstshift_end, r.secondshift_begin, r.secondshift_end, r.thirdshift_begin, r.thirdshift_end, r.fourthshift_begin, r.fourthshift_end, r.site_id_fk];
        db.create_hours(shifthours, function(err, hour) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('this should be working');
                            }
                        });
                      },
    // Add a new employee
    createEmployee: function(req, res, next) {
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
  siteOverview: function(req,res,next){
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
    });
  },

  // shows contract hours

  scheduleHours: function(req,res,next){
    db.schedule_hours([req.params.id],function(err,hours){
      if(err){
        res.send(err,'days not viewed');
      } else{
        res.send(hours);
      }
    });
  },

  employeeSchedule: function(req,res,next){

    var r = req.body;
    console.log(r);
    var empArr = [r.user_id_fk, r.site_id_fk,r.contract_time_fk,r.shift_num];
    console.log(empArr);
    db.employee_schedule(empArr,function(err,empShift){
      if(err){
        res.send(err,'employee schedule error');
      }
      else{
        res.send('this employee schedule has been added');
      }
    });
  },

  showSite: function(req,res,next){
    db.show_entire_site(function(err,fullsite){
      if(err){
        res.send(err,'full site not showing');
      }
      else{
        res.status(200).json(fullsite);
        console.log('full site showing up');
      }
    });
  },

  getSiteandHours: function(req,res,next){
    db.show_site([req.params.id],function(err,site){
      if(err){
        console.log(err);
        res.send(err,'site not showing');
      }
      else{
        db.show_hours_site([req.params.id],function(err,hoursandsite){
          if(err){
            res.send(err,'site and hours not showing');
          }
          else{
            res.status(200).send({site:site,hoursandsite:hoursandsite});
          }
        });
      }
    });
  },

  updateSite: function(req,res,next){
    var updateArr = [];
    db.update_site(updateArr,function(err,res){
      if(err){
        console.log('site not updated');
        res.send(err)
      }
      else{
        db.update_hours(updateArr,function(err,res){
          if(err){
            console.log('hours not updated');
            res.send(err)
          }
          else{
            console.log('site and hours updated');
            res.send(res)
          }
        })
      }
    })
  }


}; //end of module
