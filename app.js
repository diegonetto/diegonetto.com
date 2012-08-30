
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
  console.log('This is a development environment');
  app.use(express.errorHandler());
  app.set('hostname', 'localhost');
});

// production only
app.configure('production', function(){
  console.log('This is a production environment');
  app.set('hostname', 'diegonetto.com');
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), app.get('hostname'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
