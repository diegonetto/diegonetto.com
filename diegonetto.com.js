
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
//  , tweetUpdater = require('./lib/tweet-updater');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

// development only
app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(express.static(path.join(__dirname, 'public')));
});

// production only
app.configure('production', function(){
});

// Routing
app.get('/', routes.home);

// Start the Twitter Updater
// Defaults to grabbing the latest 10 Tweets every 10 minutes.
//tweetUpdater.start();

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
