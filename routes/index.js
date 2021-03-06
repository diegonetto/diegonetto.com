/**
 * Dependencies
 */
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

/**
 * Constants
 */
var HOST = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var PORT = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

/**
 * 
 */

/*
 * GET home page.
 */
exports.home = function(req, res){
  res.render('home', { title: 'Diego Netto' });

  //var db = new Db('diegonetto', new Server(HOST, PORT, {}));

  //db.open(function(err, db) {
  //  db.collection('tweets', function(err, collection) {
  //    collection.find({}, {'limit':9, 'sort':{'created_at': -1}}).toArray(function(err, results) {
  //      //res.render('home', { title: 'Diego Netto', tweets: results });
  //      db.close();
  //    });
  //  });
  //});
};

