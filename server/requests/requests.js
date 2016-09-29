var app = require('../../index');

var db = app.get('db');
console.log(db.show_site);
module.exports = {

// getSite : function(req, res, next) {
//     db.show_site(function(err, table) {
//         if (!err) {
//             res.status(200).json(table);
//         } else {
//             console.log("This isn't working.")
//         }
//     })
// }


}//end of module
