Create environemnt and add development.js into that folder fo rlocal host.


'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/angularmodeler-dev'
  },

  // Seed database on startup
  seedDB: false

};
