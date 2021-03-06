/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var mongoose = require('mongoose');

before(function (done) {

  function clearCollections() {
    for (var collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].deleteMany(function() {});
    }
    return done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.test.db, function (err) {
      if (err) throw err;
      return clearCollections();
    });
  } else {
    return clearCollections();
  }
});

after(function (done) {
  mongoose.disconnect();
  return done();
});

chai.use(chaiHttp);

let putId = '';

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .send({
            project: 'test',
            issue_title: 'Every Field Fill',
            issue_text: 'Some text to pass all fields',
            created_by: 'Functional Test - Every field filled in',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end(function(err, res) {
            testId = res.body._id;
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.property(res.body, '_id');
            assert.equal(res.body.project, 'test');
            assert.equal(res.body.issue_title, 'Every Field Fill');
            assert.equal(res.body.issue_text, 'Some text to pass all fields');
            assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
            assert.equal(res.body.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.status_text, 'In QA');
            done();
          });
      });
      
      test('Required fields filled in', function(done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Required fields filled in',
            issue_text: 'Some text to pass required fields',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            testId = res.body._id;
            putId = testId;
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.property(res.body, '_id');
            assert.equal(res.body.issue_title, 'Required fields filled in');
            assert.equal(res.body.issue_text, 'Some text to pass required fields');
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Missing required fields',
            issue_text: '',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            testId = res.body._id;
            assert.isString(res.text)
            assert.equal(res.status, 500);
            
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: putId
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.isString(res.text)
            assert.equal(res.text, 'no updated field sent');
            done();
          })
      });
      
      test('One field to update', function(done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: putId,
            issue_title: 'PUT one field'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: putId,
            issue_title: 'PUT Multi fields',
            open: true,
            issue_text: 'This shit is closed!!!'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'Every Field Fill'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_text, 'Some text to pass all fields');
          assert.equal(res.body[0].status_text, 'In QA');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_text: 'This shit is closed!!!',
          issue_title: 'PUT Multi fields',
          open: false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_text, 'This shit is closed!!!');
          assert.equal(res.body[0].issue_title, 'PUT Multi fields');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 503);
            assert.equal(res.text, '_id error');
            done();
          })
      });
      
      test('Valid _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/test')
          .send({_id: putId})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'deleted ' + putId);
            done();
          })
      });
      
    });

});
