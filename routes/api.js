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
      Issue.find({ ...req.query, project }, (err, docs) => {
        if(err) res.status(500).send(err);
        res.status(200).json(docs);
      })
      
    })
    
    .post(function (req, res){     
      var project = req.params.project;      
      var newIssue = new Issue(req.body);
      newIssue.project = project;

      newIssue.save().then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(500).json(err);
      })
    })
    
    .put(function (req, res){
      if (!req.body._id) {
        res.status(400).send('missing issue id field');
      }else{
        const updateIssue = {}
        if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.hasOwnProperty('open')) {
          res.status(400).send('no updated field sent');
        } else {
          if (req.body.issue_title) updateIssue.issue_title = req.body.issue_title;
          if (req.body.issue_text) updateIssue.issue_text = req.body.issue_text;
          if (req.body.created_by) updateIssue.created_by = req.body.created_by;
          if (req.body.assigned_to) updateIssue.assigned_to = req.body.assigned_to;
          if (req.body.status_text) updateIssue.status_text = req.body.status_text;
          if (req.body.hasOwnProperty('open')) updateIssue.open = !req.body.open;
          updateIssue.updated_on = new Date();
          updateIssue.project = req.params.project;        
          Issue.findByIdAndUpdate(req.body._id, {$set: updateIssue}, {useFindAndModify: false}, (err, issue) => {
            if(err) {
              res.status(500).send('could not update ' + req.body._id);
            }else{
              res.status(200).send('successfully updated');
            }
          })
        }  
      }      
    })
    
    .delete(function (req, res){
      if (!req.body._id) {
        res.status(503).send('_id error');
      }else{
        Issue.findByIdAndDelete(req.body._id, (err, del) => {
          if(err) res.status(503).send('could not delete ' + req.body._id);
          res.status(200).send('deleted ' + del._id);
        })
      }
      
    });
    
};
