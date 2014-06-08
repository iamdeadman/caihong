'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    db = require('./lib/models');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

// Bootstrap models
//var modelsPath = path.join(__dirname, 'lib/models');
//fs.readdirSync(modelsPath).forEach(function (file) {
//  if (/(.*)\.(js$|coffee$)/.test(file)) {
//    require(modelsPath + '/' + file);
//  }
//});

// Populate empty DB with sample data
//require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
require('./lib/config/express')(app);
require('./lib/routes')(app);

db.sequelize.sync({force: false}).complete(function(err) {
  if (err) {
      debugger;
    throw err[0]
  } else {
      debugger;
    // Start server
    app.listen(config.port, config.ip, function () {
      console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
    });
  }
})

// Expose app
exports = module.exports = app;
