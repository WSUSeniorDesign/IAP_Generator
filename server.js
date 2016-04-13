
/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var ConnectRoles = require('connect-roles');
var config = require('./config/config');

var app = express();
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap connect-roles
var roles = require('./config/roles')(ConnectRoles, config);

// Bootstrap application settings
require('./config/express')(app, passport, roles);

// Bootstrap routes
require('./config/routes')(app, passport, roles);

app.listen(port);
console.log('Express app started on port ' + port);

module.exports.app = app;
