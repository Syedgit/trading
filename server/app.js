// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
// var methodOverride = require('method-override');

// configuration ===========================================
    
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
// app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client')); 

// routes ==================================================
require('./routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);


// expose app           
exports = module.exports = app;

/*
/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import https from 'https';
import * as fs from 'fs';
import bodyParser  from 'body-parser';
// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);

if(process.env.NODE_ENV !== 'development') {
  var credentials = {
    key: fs.readFileSync('../keyCert/blink.pem'),
    cert: fs.readFileSync('../keyCert/blink.pem')
  };
  var https_server = https.createServer(credentials, app);
}

require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });

  if(process.env.NODE_ENV !== 'development') {
    https_server.listen(config.https_port, config.ip, function () {
      console.log('Express server listening on %d, in %s mode', config.https_port, app.get('env'));
    });
  }
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
*/
