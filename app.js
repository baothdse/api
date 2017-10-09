var port = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var bot = require('./bot/bot-config.js');
var app = express();

//morgan
app.use(morgan('dev'));  

//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.listen(port);

// get user message
app.post('/api/messages', bot.listen());

console.log("Server start on port: " + port);

module.exports = app;
