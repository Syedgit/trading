//create specific folder name under server dir like (diagram or user) then add following.
//CONTROLLER.JS

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/diagrams              ->  index
 * POST    /api/diagrams              ->  create
 * GET     /api/diagrams/:id          ->  show
 * PUT     /api/diagrams/:id          ->  update
 * DELETE  /api/diagrams/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Diagram = require('./diagram.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Diagrams
export function index(req, res) {
  Diagram.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

export function userDiagram(req,res) {
  Diagram.find( { $or: [ {'groups': { $in: req.user.groups}},
                          {'owner': req.user._id},
                          {'users': { $in: req.user._id }} ]} )
      .populate('owner','groups','users')
      .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res))
}

// Gets a single Diagram from the DB
export function show(req, res) {
  Diagram.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Diagram in the DB
export function create(req, res) {
  console.log(req.body);
  Diagram.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Diagram in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log(req.body);
  Diagram.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Diagram from the DB
export function destroy(req, res) {
  Diagram.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


//INDEX.JS

'use strict';

var express = require('express');
var controller = require('./diagram.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/user', controller.userDiagram)
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;


//MODELS

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
