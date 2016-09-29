const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const massive = require('massive');
const config = require('./server/config/config.json');


var app = module.exports = express();

app.use(bodyParser.json());
app.use(cors());

app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));

var db = massive.connectSync({db: "SiteKeeper"});
app.set('db', db);
app.use(express.static(__dirname + '/frontend'));

const request = require('./server/requests/requests.js');

app.get('/site',request.getSite);




app.listen(config.port, function() {
    console.log('listening on port', config.port);
})
