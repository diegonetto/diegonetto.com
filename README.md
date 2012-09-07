# diegonetto.com

#### The source code powering my portfolio website. 



### Key technologies used:
- [Node.js](http://nodejs.org/)
- [Express.js](http://expressjs.com/)
- [Jade](http://jade-lang.com/)
- [Underscore.js](http://underscorejs.org/)
- [MongoDB](https://github.com/mongodb/node-mongodb-native)


### [Tweet Updater](https://github.com/diegonetto/diegonetto.com/blob/master/lib/tweet-updater.js)

This small library I wrote connects to a local MongoDB database, pulls the latest 10 Tweets from my Timeline via the [Twitter API](http://dev.twitter.com/docs/api/1/get/statuses/user_timeline), fetches the [oEmbed](http://dev.twitter.com/docs/api/1/get/statuses/oembed) object for each one, and caches them (along with a timestamp) in the database. This repeates every five minutes, or as otherwise specified in the call to .start().
