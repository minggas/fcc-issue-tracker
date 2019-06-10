/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Issue = require('../models/Issue').Issue;

mongoose.connect(process.env.DB, {useNewUrlParser: true});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){     
      var project = req.params.project;      
      var newIssue = new Issue(req.body);
      newIssue.project = project;

      newIssue.save().then(result => {
        res.status(200);
        res.json(result);
      }).catch(err => {
        res.status(500);
        res.json(err);
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
