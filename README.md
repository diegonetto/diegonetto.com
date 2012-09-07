# diegonetto.com

#### The source code powering my portfolio website. 



### Key technologies used:
- [Node.js](http://nodejs.org/)
- [Express.js](http://expressjs.com/)
- [Jade](http://jade-lang.com/)
- [Underscore.js](http://underscorejs.org/)
- [MongoDB](https://github.com/mongodb/node-mongodb-native)


### [Tweet updater](https://github.com/diegonetto/diegonetto.com/blob/master/lib/tweet-updater.js)

This small library connects to a local MongoDB database, pulls the latest 10 Tweets from my Timeline, and fetches the oEmbed object for each one, caching them in the database.
