// __Dependencies__

var express = require('express');
var config = require('config');
var stripe = require('stripe')(
  config.stripe.secret
);
//taxamo
var client = require('swagger-client');
var schemata = require('../schemata/user.js');
 
var mongoose = require('mongoose');
var User = schemata.userModel; //Creates the model instance, from the user schema export

// __Module Definition__
var controller = module.exports = express();

//use your private token here, since we're talking server-server
client.authorizations.add("apiKey", new client.ApiKeyAuthorization("private_token", config.taxamo.secret, "query"));

controller.post('/taxamo', function (req, res, next) {
	var customerData = req.body;
	var formErrors = false;
	var email = customerData.email;
	var username = customerData.username;
	var password = customerData.password;
	
	if (email === undefined || email === null){
		formErrors = true;
	} else if (username === undefined || username === null) {
		formErrors = true;
	} else if (password === undefined || password === null) {
		formErrors = true;
	} else {
		formErrors = false;
	}
	
	if (formErrors === true) {
		res.status(401).send("The payment form is missing information");
	}
	
	// In production you'd do this step using something like passport.js, but for simplicity I'll skip that:
	
		user = new User ({ //Building off model created earlier in this file
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		});

		user.save(function(err) {
			if(err){
				console.log(err);
				return res.status(500).send( 'That email or username is already in use' );
			} else {
				console.log('user: ' + user + ' saved');
				res.status(200).json(user);
			}
		});
		
});

