var app = require('../../index');

var db = app.get('db');

module.exports = {
// View Exsisting Sites
getsite: function(req, res, next) {
    db.show_site(function(err, site) {
        if (!err) {
            res.status(200).json(site);
        } else {
            console.log("This isn't working.")
        }
    })
},
// Add a new site
createsite: function(req,res,next){
  var r = req.body;
  var siteArray = [r.name,r.address,r.site_info,r.contract_length,r.hours];
  console.log(siteArray);
  db.create_site(siteArray,function(err,site){
    if(err){
      res.send(err);
    }
    else{
      res.send('site added')
    }
  })
}


}//end of module
