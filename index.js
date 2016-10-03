const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const massive = require('massive');
const config = require('./server/config/config.json');
var connectionstring = config.connectionString;

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));
var massiveInstance = massive.connectSync({connectionString: connectionstring});

app.set('db', massiveInstance);

app.use(express.static(__dirname + '/frontend'));
module.exports = app;
const request = require('./server/requests/requests.js');
var db = app.get('db');


//Beginning of EndPoints
app.get('/site', request.getsite);
app.post('/createsite', request.createsite);










app.listen(config.port, function() {
    console.log('listening on port', config.port);
})
