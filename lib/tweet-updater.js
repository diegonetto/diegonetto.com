/**
 *  Module dependencies
 */
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;
var http = require('http');
var events = require('events');
var _ = require('underscore');

/**
 *  Module constants
 */
var LOG_TAG = '  Tweet Updater: '
var DEFAULT_DELAY = 300000;
var NUM_TWEETS = 10;
var MY_TIMELINE = 'http://api.twitter.com/1/statuses/user_timeline.json?include_rts=true&screen_name=diegonetto11';
var O_EMBED_BASE = 'http://api.twitter.com/1/statuses/oembed.json?omit_script=true&id=';
var HOST = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var PORT = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

/**
 *  Module variables
 */
var timeoutId = 0;
var tweetCollection = {};
var TweetUpdater = new events.EventEmitter();

// Connect to 'diegonetto' database.
console.log(LOG_TAG + 'connecting to database at ' + HOST + ':' + PORT);
var db = new Db('diegonetto', new Server(HOST, PORT, {}));

/**
 * Start the Tweet Updater
 */
exports.start = function(delay, numTweets) {
  console.log(LOG_TAG + 'Starting');
  var delay = delay || DEFAULT_DELAY;
  NUM_TWEETS = numTweets || NUM_TWEETS;

  // Open the database connection
  db.open(function(err, db) {
    console.log(LOG_TAG + 'opened database connection');
    db.collection('tweets', function(err, collection) {
      tweetCollection = collection;
    });
  });  

  // Start things off by pulling tweets.
  pullTweets();

  // Set Timer for pulling down embedded tweets
  timeoutId = setInterval(pullTweets, delay);
};

/**
 * Stop the Tweet Updater
 */
exports.stop = function() {
  console.log(LOG_TAG + 'Stopping');
  clearTimeout(timeoutId);

  // Close the database connection
  console.log(LOG_TAG + 'closing database connection');
  db.close();
}

/**
 * Make a request to the Twitter API for my last NUM_TWEETS
 * and emit the 'tweets' event if a JSON object was successfully
 * parsed from the data when the request ends.
 */
function pullTweets() {
  console.log(LOG_TAG + 'pulling recent Tweets');
  var url = MY_TIMELINE + '&count=' + NUM_TWEETS;

  // Make a request to retrieve most recent num Tweets
  http.get(url, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      var tweets = JSON.parse(data);
      if (tweets) {
        TweetUpdater.emit('tweets', tweets);
      }
    });

    res.on('close', function(err) {
      console.log(LOG_TAG + 'error pulling tweets: '+ err);
    });
  }).on('error', function(err) {
    console.log(LOG_TAG + 'error with HTTP request for ' + url + ' : ' + err);
  });
};

/**
 * Listen for the 'tweets' event and make a request to the Twitter
 * API for each tweet's oEmbed endpoint. When the request ends, 
 * parse the resulting JSON and if valid insert into tweetCollection.
 */
TweetUpdater.on('tweets', function(tweets) {
  // Remove all Tweets from the collection, if any
  tweetCollection.remove({}, function( err, result) {
    _.each(tweets, function(tweet, id, tweets) {
      var url = O_EMBED_BASE + tweet.id_str;

      http.get(url, function(res) {
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        });

        res.on('end', function() {
          var oEmbed = JSON.parse(data);
          if (oEmbed) {
            oEmbed.created_at = Date.parse(tweet.created_at);
            console.log(LOG_TAG + 'saving tweet');
            tweetCollection.insert(oEmbed);
          }
        });

        res.on('close', function(err) {
          console.log(LOG_TAG + 'error retrieving oEmbed object: ' + err);
        });
      }).on('error', function(err) {
        console.log(LOG_TAG + 'error with HTTP request for ' + url + ' : ' + err);
        pullTweets();
      });

    });
  }); 
});
