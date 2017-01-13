'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var User = require('../user/user.model.js');
var Group = require('../group/group.model.js');

var DiagramSchema = new mongoose.Schema({
  text: String,
  owner: {type: String, ref:'User'},
  groups: [{type: String, ref: 'Group'}],
  users: [{type: String, ref: 'User'}],
  content: String,
  shared: Boolean
});

export default mongoose.model('Diagram', DiagramSchema);