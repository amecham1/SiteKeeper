const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const config = require('./server/config/config.json')

const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));

app.listen(config.port,function(){
  console.log('listening on port',config.port);
})
