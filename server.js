// __Module Dependencies__

// __express and express middleware__

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// __db__
var schemata = require('./schemata/user.js');
var mongoose = require('mongoose');

// __other middleware__
var path = require('path');
var config = require('config');

// __routes__
var controllers = require('./controllers');

// __Stripe and Taxamo__

var stripe = require('stripe')(config.stripe.secret);
//taxamo
var client = require('swagger-client');

//replace "SamplePrivateTestKey1 with your private key from the taxamo dashboard
client.authorizations.add("apiKey", new client.ApiKeyAuthorization("private_token", config.taxamo.secret, "query"));

// __DATABASE CONNECT__
			
mongoose.connect(config.mongo.url); //replace with your DB name/URI

var conn = mongoose.connection;

// __Create server__
var app = express();


conn.on('open', function(e) {
	
	app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({extended: false})); 

	//Show all errors in development
	if (process.env.NODE_ENV === 'development') {
	  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
	}

	//AUTHENTICATION
	app.use(cookieParser());
	//here you would setup the session middleware and passport.js or other auth handler


	app.use( express.static( path.join( __dirname, 'site') ) );
	
	//Routes
	app.use('/api/payment', controllers.payment);
	app.use('/api/webhooks', controllers.webhooks);


	app.use(function(err, req, res, next){
	  res.status(500).send('Server Error');
	});

});

conn.on('connected', function(){

	//initialize the API with swagger.js client, and then start the server on port 3000
	var taxamo = new client.SwaggerApi({
	  url: 'https://api.taxamo.com/swagger',
	  success: function() {
	    if(taxamo.ready === true) {
	        app.listen(3000, function() {
				console.log( 'Express server listening on port %d in %s mode', 3000, app.settings.env );
			});
	    }
	  } //Add error handling

	});
});