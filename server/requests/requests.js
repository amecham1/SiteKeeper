var app = require('../../index');

var db = app.get('db');

module.exports = {

getSite: function(req, res, next) {
    db.show_site(function(err, site) {
        if (!err) {
            res.status(200).json(site);
        } else {
            console.log("This isn't working.")
        }
    })
}



// readProducts: function(req, res, next) {
//   db.read_products(function(err,product){
//     if(!err) {
//       res.status(200).json(product);
//     }
//     else{
//       console.log('run for the hills!');
//     }
//   })
// },//end of readProducts


}//end of module
